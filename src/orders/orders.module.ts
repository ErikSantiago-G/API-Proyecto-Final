import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController, AdminOrdersController } from "./orders.controller";

@Module({
  controllers: [OrdersController, AdminOrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
