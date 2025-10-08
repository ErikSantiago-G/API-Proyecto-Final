import { Controller, Get, Query, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller()
export class PaymentResultController {
  constructor(private prisma: PrismaService) {}

  @Get('success')
  async success(@Query('session_id') sessionId: string) {
    if (!sessionId) {
      throw new HttpException(
        {
          success: true,
          message: 'Pago procesado correctamente',
          data: null,
        },
        HttpStatus.OK,
      );
    }

    const order = await this.prisma.order.findFirst({
      where: { stripeSessionId: sessionId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!order) {
      throw new HttpException(
        {
          success: false,
          message: 'Orden no encontrada',
          error: 'ORDER_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      message: 'Pago completado exitosamente',
      data: {
        orderId: order.id,
        orderNumber: order.id.substring(0, 8).toUpperCase(),
        status: order.status,
        totalAmount: Number(order.totalAmount),
        shippingAddress: order.shippingAddress,
        stripePaymentId: order.stripePaymentId,
        stripeSessionId: order.stripeSessionId,
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: Number(item.price),
          subtotal: Number(item.price) * item.quantity,
          product: {
            id: item.product.id,
            name: item.product.name,
            slug: item.product.slug,
            price: Number(item.product.price),
            images: item.product.images,
          },
        })),
        user: {
          email: order.user.email,
          firstName: order.user.firstName,
          lastName: order.user.lastName,
        },
      },
    };
  }

  @Get('cancel')
  cancel() {
    return {
      success: false,
      message: 'Pago cancelado por el usuario',
      data: {
        reason: 'USER_CANCELLED',
        description: 'El usuario canceló el proceso de pago. El carrito sigue disponible.',
      },
    };
  }
}
