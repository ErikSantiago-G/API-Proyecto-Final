import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateBannerDto } from "../dto/create-banner.dto";
import { UpdateBannerDto } from "../dto/update-banner.dto";

@Injectable()
export class BannersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crea un nuevo banner en la base de datos.
   *
   * @param {CreateBannerDto} createBannerDto - Datos del banner a crear.
   * @returns - Retorna el banner creado.
   */
  async create(createBannerDto: CreateBannerDto) {
    return this.prisma.banner.create({
      data: createBannerDto,
    });
  }

  /**
   * Obtiene todos los banners, opcionalmente filtrando por estado activo.
   *
   * @param {boolean} [isActive] - Indica si se deben filtrar solo los banners activos.
   * @returns - Lista de banners ordenada por el campo `order`.
   */
  async findAll(isActive?: boolean) {
    const where = isActive !== undefined ? { isActive } : {};

    return this.prisma.banner.findMany({
      where,
      orderBy: { order: "asc" },
    });
  }

  /**
   * Obtiene un banner específico por su ID.
   *
   * @param {string} id - ID del banner a buscar.
   * @returns - Retorna el banner encontrado.
   * @throws {NotFoundException} - Si no se encuentra el banner.
   */
  async findOne(id: string) {
    const banner = await this.prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) throw new NotFoundException("Banner no encontrado");

    return banner;
  }

  /**
   * Actualiza los datos de un banner existente.
   *
   * @param {string} id - ID del banner a actualizar.
   * @param {UpdateBannerDto} updateBannerDto - Datos a actualizar del banner.
   * @returns - Retorna el banner actualizado.
   * @throws {NotFoundException} - Si no se encuentra el banner.
   */
  async update(id: string, updateBannerDto: UpdateBannerDto) {
    await this.findOne(id);

    return this.prisma.banner.update({
      where: { id },
      data: updateBannerDto,
    });
  }

  /**
   * Elimina un banner de la base de datos.
   *
   * @param {string} id - ID del banner a eliminar.
   * @returns - Retorna el banner eliminado.
   * @throws {NotFoundException} - Si no se encuentra el banner.
   */
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.banner.delete({
      where: { id },
    });
  }
}
