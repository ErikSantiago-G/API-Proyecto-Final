import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { CheckoutService } from "./checkout.service";
import { CreateCheckoutDto } from "./dto/create-checkout.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { JwtPayload } from "../auth/types/auth.types";

@ApiTags("checkout")
@Controller("checkout")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post("create")
  @ApiOperation({ summary: "Create Stripe checkout session" })
  createCheckout(@CurrentUser() user: JwtPayload, @Body() createCheckoutDto: CreateCheckoutDto) {
    return this.checkoutService.createCheckoutSession(user.sub, createCheckoutDto);
  }
}
