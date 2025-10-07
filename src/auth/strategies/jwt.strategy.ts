import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "../types/auth.types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET"),
    });
  }

  /**
   * Valida y retorna el payload decodificado del access token.
   * 
   * Este método se ejecuta automáticamente una vez que Passport ha
   * verificado la validez y la firma del token.
   *
   * @param {JwtPayload} payload - Datos decodificados del token JWT.
   * @returns {JwtPayload} Un objeto con la información esencial del usuario autenticado.
   */
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    return { sub: payload.sub, email: payload.email, role: payload.role };
  }
}
