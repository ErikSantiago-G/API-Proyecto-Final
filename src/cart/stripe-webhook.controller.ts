import { Controller, Post, Headers, Req, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiExcludeEndpoint } from "@nestjs/swagger";
import { CheckoutService } from "./checkout.service";
import { Request } from "express";

@ApiTags("webhooks")
@Controller("webhooks")
export class StripeWebhookController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post("stripe")
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint()
  async handleStripeWebhook(@Headers("stripe-signature") signature: string, @Req() req: Request) {
    const rawBody = req.body;
    return this.checkoutService.handleStripeWebhook(signature, rawBody);
  }
}
