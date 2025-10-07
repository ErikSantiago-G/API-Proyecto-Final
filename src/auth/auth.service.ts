import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { RegisterDto } from "./dto/register.dto";
import { AuthUser, AuthTokens, JwtPayload } from "./types/auth.types";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Valida las credenciales de un usuario verificando su correo y contraseña.
   *
   * @param {string} email - Correo electrónico del usuario.
   * @param {string} password - Contraseña en texto plano ingresada por el usuario.
   * @returns {Promise<AuthUser>} - Retorna el usuario autenticado sin incluir la contraseña.
   * @throws {UnauthorizedException} - Si el correo o la contraseña no son válidos.
   */
  async validateUser(email: string, password: string): Promise<AuthUser> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new UnauthorizedException("Invalid credentials");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }

  /**
   * Registra un nuevo usuario en la base de datos, encriptando su contraseña.
   *
   * @param {RegisterDto} registerDto - Datos enviados por el cliente para el registro.
   * @returns Retorna el usuario creado sin datos sensibles.
   */
  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, refreshToken: __, ...result } = user;
    return result;
  }

  /**
   * Inicia sesión generando un par de tokens (access y refresh) para el usuario.
   *
   * @param {AuthUser} user - Objeto del usuario autenticado (sin contraseña).
   * @returns {Promise<AuthTokens>} - Retorna los tokens de acceso y de actualización.
   */
  async login(user: AuthUser): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRES_IN") || "7d",
    });

    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresca los tokens del usuario (access y refresh) usando un refresh token válido.
   *
   * @param {string} userId - Identificador único del usuario.
   * @param {string} refreshToken - Token de actualización actual enviado por el cliente.
   * @returns {Promise<AuthTokens>} - Retorna nuevos tokens válidos.
   * @throws {UnauthorizedException} - Si el refresh token no coincide o no existe.
   */
  async refreshToken(userId: string, refreshToken: string): Promise<AuthTokens> {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) throw new UnauthorizedException("Access denied");

    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!refreshTokenMatches) throw new UnauthorizedException("Access denied");

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    
    const accessToken = this.jwtService.sign(payload);
    const newRefreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRES_IN"),
    });

    await this.usersService.updateRefreshToken(user.id, newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Cierra la sesión del usuario eliminando su refresh token de la base de datos.
   *
   * @param {string} userId - Identificador único del usuario.
   */
  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
  }
}
