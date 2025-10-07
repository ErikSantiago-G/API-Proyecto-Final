import { Controller, Get, Patch, Param, Body, UseGuards, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { OrdersService } from "./orders.service";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { UserRole, OrderStatus } from "@prisma/client";
import { JwtPayload } from "../auth/types/auth.types";

@ApiTags("orders")
@Controller("orders")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: "Get user orders" })
  @ApiQuery({ name: "status", required: false, enum: OrderStatus })
  getUserOrders(@CurrentUser() user: JwtPayload, @Query("status") status?: OrderStatus) {
    return this.ordersService.getUserOrders(user.sub, status);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get order by ID" })
  findOne(@CurrentUser() user: JwtPayload, @Param("id") id: string) {
    return this.ordersService.findOne(id, user.sub);
  }
}

@ApiTags("admin/orders")
@Controller("admin/orders")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Get all orders (Admin/Manager only)" })
  @ApiQuery({ name: "status", required: false, enum: OrderStatus })
  findAll(@Query("status") status?: OrderStatus) {
    return this.ordersService.findAll(undefined, status);
  }

  @Get(":id")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Get order by ID (Admin/Manager only)" })
  findOne(@Param("id") id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(":id/status")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Update order status (Admin/Manager only)" })
  updateStatus(@Param("id") id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, updateOrderStatusDto);
  }
}
