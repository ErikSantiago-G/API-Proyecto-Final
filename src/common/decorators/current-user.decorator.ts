import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * @decorator CurrentUser
 * 
 * Este decorador extrae el objeto `user` del objeto `request`, el cual
 * normalmente es añadido por un guard de autenticación
 *
 * @param {ExecutionContext} context - Contexto de ejecución de NestJS que permite acceder al request HTTP.
 * @returns {JwtPayload} El usuario autenticado contenido en `request.user`.
 */
export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return request.user;
});
