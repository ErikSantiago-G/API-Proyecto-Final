import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { FilterProductDto } from "./dto/filter-product.dto";
import { UpdateStockDto } from "./dto/update-stock.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  /**
   * Crea un nuevo producto.
   *
   * @param {CreateProductDto} createProductDto - Datos para crear el producto.
   * @returns - El producto creado incluyendo su categoría.
   */
  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
      include: { category: true },
    });
  }

  /**
   * Obtiene todos los productos con filtros y paginación opcionales.
   *
   * @param {FilterProductDto} filterDto - DTO con filtros y opciones de paginación.
   * @returns - Lista de productos con meta información (total, página, límite, totalPages).
   */
  async findAll(filterDto: FilterProductDto) {
    const { page = 1, limit = 10, categoryId, search, minPrice, maxPrice, isActive } = filterDto;

    const where: Prisma.ProductWhereInput = {
      AND: [
        categoryId && { categoryId },
        isActive !== undefined && { isActive },
        search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        },
        (minPrice !== undefined || maxPrice !== undefined) && {
          price: {
            gte: minPrice ?? undefined,
            lte: maxPrice ?? undefined,
          },
        },
      ].filter(Boolean) as Prisma.ProductWhereInput[],
    };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: { category: true },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Obtiene un producto por su ID.
   *
   * @param {string} id - ID del producto.
   * @returns - Producto encontrado incluyendo su categoría.
   * @throws {NotFoundException} Si no se encuentra el producto.
   */
  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) throw new NotFoundException("Product not found");

    return product;
  }

  /**
   * Obtiene un producto por su slug.
   *
   * @param {string} slug - Slug del producto.
   * @returns - Producto encontrado incluyendo su categoría.
   * @throws {NotFoundException} Si no se encuentra el producto.
   */
  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (!product) throw new NotFoundException("Product not found");

    return product;
  }

  /**
   * Actualiza un producto existente.
   *
   * @param {string} id - ID del producto a actualizar.
   * @param {UpdateProductDto} updateProductDto - Datos para actualizar el producto.
   * @returns - Producto actualizado incluyendo su categoría.
   * @throws {NotFoundException} Si no se encuentra el producto.
   */
  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: { category: true },
    });
  }

  /**
   * Actualiza únicamente el stock de un producto.
   *
   * @param {string} id - ID del producto a actualizar.
   * @param {UpdateStockDto} updateStockDto - Objeto que contiene la nueva cantidad de stock.
   * @returns - Producto actualizado incluyendo su categoría.
   * @throws {NotFoundException} Si no se encuentra el producto.
   */
  async updateStock(id: string, updateStockDto: UpdateStockDto) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: { stock: updateStockDto.stock },
      include: { category: true },
    });
  }

  /**
   * Elimina un producto por su ID.
   *
   * @param {string} id - ID del producto a eliminar.
   * @returns - Producto eliminado.
   * @throws {NotFoundException} Si no se encuentra el producto.
   */
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.product.delete({ where: { id } });
  }
}
