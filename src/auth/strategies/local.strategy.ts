import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { AuthUser } from "../types/auth.types";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: "email" });
  }

  /**
   * Valida las credenciales del usuario.
   * 
   * Este método es llamado automáticamente por Passport cuando se usa la estrategia local.
   * Si las credenciales son válidas, devuelve la información del usuario autenticado;
   * si no, `AuthService` lanzará una excepción (`UnauthorizedException`).
   *
   * @param {string} email - Correo electrónico del usuario.
   * @param {string} password - Contraseña del usuario.
   * @returns {Promise<AuthUser>} Promesa que resuelve con el usuario autenticado.
   */
  async validate(email: string, password: string): Promise<AuthUser> {
    return this.authService.validateUser(email, password);
  }
}
