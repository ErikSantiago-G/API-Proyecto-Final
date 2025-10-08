import { Module } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";
import { CheckoutService } from "./checkout.service";
import { CheckoutController } from "./checkout.controller";
import { StripeWebhookController } from "./stripe-webhook.controller";
import { ProductsModule } from "../products/products.module";
import { PaymentResultController } from "./payment-result.controller";

@Module({
  imports: [ProductsModule],
  controllers: [CartController, CheckoutController, StripeWebhookController, PaymentResultController],
  providers: [CartService, CheckoutService],
})
export class CartModule {}
