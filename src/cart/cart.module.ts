import { Module } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";
import { CheckoutService } from "./checkout.service";
import { CheckoutController } from "./checkout.controller";
import { StripeWebhookController } from "./stripe-webhook.controller";
import { ProductsModule } from "../products/products.module";

@Module({
  imports: [ProductsModule],
  controllers: [CartController, CheckoutController, StripeWebhookController],
  providers: [CartService, CheckoutService],
})
export class CartModule {}
