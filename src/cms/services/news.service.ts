import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateNewsDto } from "../dto/create-news.dto";
import { UpdateNewsDto } from "../dto/update-news.dto";

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crea una nueva noticia en la base de datos.
   *
   * @param {CreateNewsDto} createNewsDto - Datos de la noticia a crear.
   * @returns - Retorna la noticia creada.
   */
  async create(createNewsDto: CreateNewsDto) {
    return this.prisma.news.create({
      data: createNewsDto,
    });
  }

  /**
   * Obtiene todas las noticias, opcionalmente filtrando por estado activo.
   *
   * @param {boolean} [isActive] - Indica si se deben filtrar solo las noticias activas.
   * @returns - Lista de noticias ordenada por fecha de publicación descendente.
   */
  async findAll(isActive?: boolean) {
    const where = isActive !== undefined ? { isActive } : {};

    return this.prisma.news.findMany({
      where,
      orderBy: { publishedAt: "desc" },
    });
  }

  /**
   * Obtiene una noticia específica por su ID.
   *
   * @param {string} id - ID de la noticia a buscar.
   * @returns - Retorna la noticia encontrada.
   * @throws {NotFoundException} - Si no se encuentra la noticia.
   */
  async findOne(id: string) {
    const news = await this.prisma.news.findUnique({
      where: { id },
    });

    if (!news) throw new NotFoundException("News not found");

    return news;
  }

  /**
   * Obtiene una noticia específica por su slug.
   *
   * @param {string} slug - Slug de la noticia a buscar.
   * @returns - Retorna la noticia encontrada.
   * @throws {NotFoundException} - Si no se encuentra la noticia.
   */
  async findBySlug(slug: string) {
    const news = await this.prisma.news.findUnique({
      where: { slug },
    });

    if (!news) throw new NotFoundException("News not found");

    return news;
  }

  /**
   * Actualiza los datos de una noticia existente.
   *
   * @param {string} id - ID de la noticia a actualizar.
   * @param {UpdateNewsDto} updateNewsDto - Datos a actualizar de la noticia.
   * @returns - Retorna la noticia actualizada.
   * @throws {NotFoundException} - Si no se encuentra la noticia.
   */
  async update(id: string, updateNewsDto: UpdateNewsDto) {
    await this.findOne(id);

    return this.prisma.news.update({
      where: { id },
      data: updateNewsDto,
    });
  }

  /**
   * Elimina una noticia de la base de datos.
   *
   * @param {string} id - ID de la noticia a eliminar.
   * @returns - Retorna la noticia eliminada.
   * @throws {NotFoundException} - Si no se encuentra la noticia.
   */
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.news.delete({
      where: { id },
    });
  }
}
