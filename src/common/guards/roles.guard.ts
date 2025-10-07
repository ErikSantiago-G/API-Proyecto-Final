import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "@prisma/client";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Determina si la solicitud actual tiene permiso de acceso según los roles requeridos.
   *
   * Este método es invocado automáticamente por NestJS antes de ejecutar la ruta
   * y se encarga de validar si el rol del usuario coincide con alguno de los roles
   * definidos mediante el decorador `@Roles()`.
   *
   * @param {ExecutionContext} context - Contexto de ejecución que permite acceder a la petición HTTP y al handler actual.
   * @returns {boolean} `true` si el usuario tiene permiso de acceso, de lo contrario, `false`.
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
