import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { OrderStatus, Prisma } from "@prisma/client";

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtiene todas las órdenes, opcionalmente filtradas por usuario o estado.
   *
   * @param {string} [userId] - ID del usuario para filtrar las órdenes.
   * @param {OrderStatus} [status] - Estado de la orden para filtrar.
   * @returns - Lista de órdenes con sus items y datos del usuario.
   */
  async findAll(userId?: string, status?: OrderStatus) {
    const where: Prisma.OrderWhereInput = {};

    if (userId) where.userId = userId;
    if (status) where.status = status;

    return this.prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
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
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Obtiene todas las órdenes, opcionalmente filtradas por usuario o estado.
   *
   * @param {string} [userId] - ID del usuario para filtrar las órdenes.
   * @param {OrderStatus} [status] - Estado de la orden para filtrar.
   * @returns - Lista de órdenes con sus items y datos del usuario.
   */
  async findOne(id: string, userId?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
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

    if (!order) throw new NotFoundException("Order not found");

    if (userId && order.userId !== userId) throw new ForbiddenException("Access denied");

    return order;
  }

  /**
   * Actualiza el estado de una orden específica.
   *
   * @param {string} id - ID de la orden a actualizar.
   * @param {UpdateOrderStatusDto} updateOrderStatusDto - DTO con el nuevo estado de la orden.
   * @returns - Orden actualizada con sus items y datos del usuario.
   * @throws {NotFoundException} - Si la orden no existe.
   */
  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    await this.findOne(id);

    return this.prisma.order.update({
      where: { id },
      data: { status: updateOrderStatusDto.status },
      include: {
        items: {
          include: {
            product: true,
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
  }

  /**
   * Obtiene todas las órdenes de un usuario específico, opcionalmente filtradas por estado.
   *
   * @param {string} userId - ID del usuario.
   * @param {OrderStatus} [status] - Estado de las órdenes a filtrar.
   * @returns - Lista de órdenes del usuario.
   */
  async getUserOrders(userId: string, status?: OrderStatus) {
    return this.findAll(userId, status);
  }
}
