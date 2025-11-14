import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ProductsService } from "../products/products.service";
import { AddToCartDto } from "./dto/add-to-cart.dto";
import { UpdateCartItemDto } from "./dto/update-cart-item.dto";

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
  ) {}

  /**
   * Obtiene el carrito de un usuario.
   * Si no existe, se crea uno nuevo.
   *
   * @param {string} userId - ID del usuario.
   * @returns - Carrito con los items y el total.
   */
  async getCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });
    }

    const total = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    return {
      ...cart,
      total,
    };
  }

  /**
   * Agrega un producto al carrito de un usuario.
   * Si el producto ya existe, aumenta la cantidad.
   *
   * @param {string} userId - ID del usuario.
   * @param {AddToCartDto} addToCartDto - DTO con el producto y cantidad a agregar.
   * @returns - Carrito actualizado.
   * @throws {BadRequestException} - Si no hay suficiente stock.
   */
  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    const product = await this.productsService.findOne(addToCartDto.productId);

    if (product.stock < addToCartDto.quantity) throw new BadRequestException("Existencias insuficientes");

    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: addToCartDto.productId,
        },
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + addToCartDto.quantity;

      if (product.stock < newQuantity) throw new BadRequestException("Existencias insuficientes");

      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: addToCartDto.productId,
          quantity: addToCartDto.quantity,
        },
      });
    }

    return this.getCart(userId);
  }

  /**
   * Actualiza la cantidad de un item en el carrito.
   *
   * @param {string} userId - ID del usuario.
   * @param {string} itemId - ID del item en el carrito.
   * @param {UpdateCartItemDto} updateCartItemDto - DTO con la nueva cantidad.
   * @returns - Carrito actualizado.
   * @throws {NotFoundException} - Si el carrito o el item no existen.
   * @throws {BadRequestException} - Si no hay suficiente stock.
   */
  async updateCartItem(userId: string, itemId: string, updateCartItemDto: UpdateCartItemDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) throw new NotFoundException("Carrito no encontrado");

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
      include: {
        product: true,
      },
    });

    if (!cartItem) throw new NotFoundException("Artículo del carrito no encontrado");

    if (cartItem.product.stock < updateCartItemDto.quantity) throw new BadRequestException("Existencias insuficientes");

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: updateCartItemDto.quantity },
    });

    return this.getCart(userId);
  }

  /**
   * Elimina un item del carrito.
   *
   * @param {string} userId - ID del usuario.
   * @param {string} itemId - ID del item a eliminar.
   * @returns - Carrito actualizado.
   * @throws {NotFoundException} - Si el carrito o el item no existen.
   */
  async removeFromCart(userId: string, itemId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) throw new NotFoundException("Carrito no encontrado");

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });

    if (!cartItem) throw new NotFoundException("Artículo del carrito no encontrado");

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return this.getCart(userId);
  }

  /**
   * Vacía todo el carrito de un usuario.
   *
   * @param {string} userId - ID del usuario.
   * @returns - Carrito vacío.
   */
  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (cart) {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return this.getCart(userId);
  }
}
