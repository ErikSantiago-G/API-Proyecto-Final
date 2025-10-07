import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { CartService } from "./cart.service";
import { AddToCartDto } from "./dto/add-to-cart.dto";
import { UpdateCartItemDto } from "./dto/update-cart-item.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { JwtPayload } from "../auth/types/auth.types";

@ApiTags("cart")
@Controller("cart")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: "Get user cart" })
  getCart(@CurrentUser() user: JwtPayload) {
    return this.cartService.getCart(user.sub);
  }

  @Post()
  @ApiOperation({ summary: "Add item to cart" })
  addToCart(@CurrentUser() user: JwtPayload, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(user.sub, addToCartDto);
  }

  @Patch(":itemId")
  @ApiOperation({ summary: "Update cart item quantity" })
  updateCartItem(
    @CurrentUser() user: JwtPayload,
    @Param("itemId") itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(user.sub, itemId, updateCartItemDto);
  }

  @Delete(":itemId")
  @ApiOperation({ summary: "Remove item from cart" })
  removeFromCart(@CurrentUser() user: JwtPayload, @Param("itemId") itemId: string) {
    return this.cartService.removeFromCart(user.sub, itemId);
  }

  @Delete()
  @ApiOperation({ summary: "Clear cart" })
  clearCart(@CurrentUser() user: JwtPayload) {
    return this.cartService.clearCart(user.sub);
  }
}
