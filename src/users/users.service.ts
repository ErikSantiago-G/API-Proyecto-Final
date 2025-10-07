import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserData } from "./types/users.types";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crea un nuevo usuario en la base de datos.
   * Lanza una excepción si el correo electrónico ya está registrado.
   *
   * @async
   * @param {CreateUserData} data - Datos del usuario a crear.
   * @throws {ConflictException} Si ya existe un usuario con el mismo correo electrónico.
   */
  async create(data: CreateUserData) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) throw new ConflictException("Email already exists");

    return this.prisma.user.create({ data });
  }

  /**
   * Busca un usuario por su correo electrónico.
   *
   * @async
   * @param {string} email - Correo electrónico del usuario a buscar.
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  /**
   * Busca un usuario por su identificador único (ID).
   * Lanza una excepción si el usuario no existe.
   *
   * @async
   * @param {string} id - Identificador único del usuario.
   * @throws {NotFoundException} Si no se encuentra el usuario.
   */
  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException("User not found");

    return user;
  }

  /**
   * Actualiza el token de actualización (refresh token) del usuario.
   * El token se almacena de forma segura mediante hashing.
   * Si se pasa `null`, se elimina el token almacenado.
   *
   * @async
   * @param {string} userId - ID del usuario cuyo token se actualizará.
   * @param {string|null} refreshToken - Nuevo token de actualización o `null` para eliminarlo.
   */
  async updateRefreshToken(userId: string, refreshToken: string | null) {
    const hashedRefreshToken = refreshToken ? await bcrypt.hash(refreshToken, 10) : null;

    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }
}
