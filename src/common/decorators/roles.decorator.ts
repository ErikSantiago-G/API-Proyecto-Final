import { SetMetadata } from "@nestjs/common";
import { UserRole } from "@prisma/client";

/**
 * Esta constante es utilizada para almacenar los metadatos de roles, por medio de clave valor.
 *
 * @constant
 */

export const ROLES_KEY = "roles";

/**
 * @decorator personalizado que define los roles permitidos
 * para acceder a un controlador o método específico.
 *
 * Este decorador utiliza la función `SetMetadata` de NestJS
 * para asociar una lista de roles (por ejemplo, `ADMIN`, `USER`, etc.)
 * con la clave `ROLES_KEY`. Luego, un guard como `RolesGuard`
 * puede leer estos metadatos y restringir el acceso según el rol
 * del usuario autenticado.
 *
 * @param {...UserRole[]} roles - Lista de roles autorizados para acceder al recurso.
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
