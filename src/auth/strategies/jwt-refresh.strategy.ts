import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "../types/auth.types";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_REFRESH_SECRET"),
    });
  }

  /**
   * Valida el payload contenido dentro del JWT de refresh.
   * 
   * Este método es llamado automáticamente por Passport después de que 
   * el token ha sido verificado y decodificado exitosamente.
   *
   * @param {JwtPayload} payload - Datos decodificados del token JWT.
   * @returns {JwtPayload} Un objeto con la información esencial del usuario autenticado.
   */
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    return { sub: payload.sub, email: payload.email, role: payload.role };
  }
}
