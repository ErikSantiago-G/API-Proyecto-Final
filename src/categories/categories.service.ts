import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crea una nueva categoría.
   *
   * @param {CreateCategoryDto} createCategoryDto - Datos de la nueva categoría.
   * @returns La categoría creada.
   */
  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  /**
   * Obtiene todas las categorías.
   *
   * @param {boolean} [isActive] - Filtra por categorías activas si se especifica.
   * @returns Lista de categorías con el conteo de productos asociados.
   */
  async findAll(isActive?: boolean) {
    const where = isActive !== undefined ? { isActive } : {};

    return this.prisma.category.findMany({
      where,
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Obtiene una categoría por su ID.
   *
   * @param {string} id - ID de la categoría.
   * @throws {NotFoundException} Si la categoría no existe.
   * @returns La categoría encontrada con conteo de productos.
   */
  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) throw new NotFoundException("Category not found");

    return category;
  }

  /**
   * Obtiene una categoría por su slug.
   *
   * @param {string} slug - Slug de la categoría.
   * @throws {NotFoundException} Si la categoría no existe.
   * @returns La categoría encontrada con conteo de productos.
   */
  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) throw new NotFoundException("Category not found");

    return category;
  }

  
  /**
   * Actualiza una categoría existente.
   *
   * @param {string} id - ID de la categoría a actualizar.
   * @param {UpdateCategoryDto} updateCategoryDto - Datos para actualizar la categoría.
   * @throws {NotFoundException} Si la categoría no existe.
   * @returns La categoría actualizada.
   */
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  /**
   * Elimina una categoría por su ID.
   *
   * @param {string} id - ID de la categoría a eliminar.
   * @throws {NotFoundException} Si la categoría no existe.
   * @returns La categoría eliminada.
   */
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.category.delete({
      where: { id },
    });
  }
}
