import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateSectionDto } from "../dto/create-section.dto";
import { UpdateSectionDto } from "../dto/update-section.dto";

@Injectable()
export class SectionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crea una nueva sección en la base de datos.
   *
   * @param {CreateSectionDto} createSectionDto - Datos de la sección a crear.
   * @returns - Retorna la sección creada.
   */
  async create(createSectionDto: CreateSectionDto) {
    return this.prisma.section.create({
      data: createSectionDto,
    });
  }

  /**
   * Obtiene todas las secciones, opcionalmente filtrando por estado activo.
   *
   * @param {boolean} [isActive] - Indica si se deben filtrar solo las secciones activas.
   * @returns - Lista de secciones ordenada por el campo `order`.
   */
  async findAll(isActive?: boolean) {
    const where = isActive !== undefined ? { isActive } : {};

    return this.prisma.section.findMany({
      where,
      orderBy: { order: "asc" },
    });
  }

  /**
   * Obtiene una sección específica por su ID.
   *
   * @param {string} id - ID de la sección a buscar.
   * @returns - Retorna la sección encontrada.
   * @throws {NotFoundException} - Si no se encuentra la sección.
   */
  async findOne(id: string) {
    const section = await this.prisma.section.findUnique({
      where: { id },
    });

    if (!section) throw new NotFoundException("Sección no encontrada");

    return section;
  }

  /**
   * Actualiza los datos de una sección existente.
   *
   * @param {string} id - ID de la sección a actualizar.
   * @param {UpdateSectionDto} updateSectionDto - Datos a actualizar de la sección.
   * @returns - Retorna la sección actualizada.
   * @throws {NotFoundException} - Si no se encuentra la sección.
   */
  async update(id: string, updateSectionDto: UpdateSectionDto) {
    await this.findOne(id);

    return this.prisma.section.update({
      where: { id },
      data: updateSectionDto,
    });
  }

  /**
   * Elimina una sección de la base de datos.
   *
   * @param {string} id - ID de la sección a eliminar.
   * @returns - Retorna la sección eliminada.
   * @throws {NotFoundException} - Si no se encuentra la sección.
   */
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.section.delete({
      where: { id },
    });
  }
}
