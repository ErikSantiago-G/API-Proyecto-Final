import { Injectable, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import Stripe from "stripe";
import { CreateCheckoutDto } from "./dto/create-checkout.dto";

@Injectable()
export class CheckoutService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>("STRIPE_SECRET_KEY"), {
      apiVersion: "2025-09-30.clover",
    });
  }

  /**
   * Crea una sesión de checkout de Stripe para un usuario específico.
   *
   * @param {string} userId - ID del usuario que realiza la compra.
   * @param {CreateCheckoutDto} createCheckoutDto - Datos necesarios para la creación del checkout (URLs de éxito y cancelación, dirección de envío, etc.)
   * @returns - Información de la sesión creada y el ID del pedido.
   * @throws {BadRequestException} Si el carrito está vacío o algún producto no tiene stock suficiente.
   */
  async createCheckoutSession(userId: string, createCheckoutDto: CreateCheckoutDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!cart || cart.items.length === 0) throw new BadRequestException("El carrito está vacío.");

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) throw new BadRequestException(`Existencias insuficientes para ${item.product.name}`);
    }

    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    const order = await this.prisma.order.create({
      data: {
        userId,
        totalAmount,
        shippingAddress: createCheckoutDto.shippingAddress,
        status: "PENDING",
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
          description: item.product.description || undefined,
          images: item.product.images.slice(0, 1),
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${createCheckoutDto.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: createCheckoutDto.cancelUrl,
      customer_email: cart.user.email,
      metadata: {
        orderId: order.id,
        userId: userId,
      },
    });

    await this.prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return {
      sessionId: session.id,
      url: session.url,
      orderId: order.id,
    };
  }

  /**
   * Maneja los webhooks de Stripe.
   *
   * @param {string} signature - Firma enviada por Stripe para validar el origen del webhook.
   * @param {Buffer} rawBody - Cuerpo crudo de la petición para validar la firma.
   * @returns - Indica que el webhook fue recibido y procesado.
   * @throws {BadRequestException} Si la verificación de la firma falla.
   */
  async handleStripeWebhook(signature: string, rawBody: Buffer) {
    const webhookSecret = this.configService.get<string>("STRIPE_WEBHOOK_SECRET");

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      throw new BadRequestException(`Falló la verificación de la firma del webhook: ${err.message}`);
    }

    switch (event.type) {
      case "checkout.session.completed":
        await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "payment_intent.succeeded":
        await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case "payment_intent.payment_failed":
        await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        console.error(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }

  /**
   * Maneja la finalización de la sesión de checkout (`checkout.session.completed`).
   *
   * @private
   * @param {Stripe.Checkout.Session} session - Objeto de sesión de Stripe que contiene metadata con el ID del pedido.
   */
  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      console.error("No orderId in session metadata");
      return;
    }

    await this.prisma.$transaction(async (transactionClient) => {
      const order = await transactionClient.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          stripePaymentId: session.payment_intent as string,
        },
        include: {
          items: true,
        },
      });

      for (const item of order.items) {
        await transactionClient.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      await transactionClient.cartItem.deleteMany({
        where: {
          cart: {
            userId: order.userId,
          },
        },
      });
    });
  }

  /**
   * Maneja la confirmación de pago exitoso (`payment_intent.succeeded`).
   *
   * @private
   * @param {Stripe.PaymentIntent} paymentIntent - Objeto PaymentIntent de Stripe.
   */
  private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    console.error("Payment succeeded:", paymentIntent.id);
  }

  /**
   * Maneja un pago fallido (`payment_intent.payment_failed`) y actualiza el estado del pedido a CANCELED.
   *
   * @private
   * @param {Stripe.PaymentIntent} paymentIntent - Objeto PaymentIntent de Stripe que falló.
   */
  private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    console.error("Payment failed:", paymentIntent.id);

    const order = await this.prisma.order.findFirst({
      where: { stripePaymentId: paymentIntent.id },
    });

    if (order) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: { status: "CANCELED" },
      });
    }
  }
}
