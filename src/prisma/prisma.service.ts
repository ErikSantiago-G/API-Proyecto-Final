import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /**
   * @function  onModuleInit
   * @async
   * 
   * Método ejecutado automáticamente cuando el módulo que contiene este servicio
   * se inicializa dentro del ciclo de vida de NestJS.
   * 
   * Establece la conexión con la base de datos a través del cliente de Prisma.
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * @function onModuleDestroy
   * @async
   * 
   * Método ejecutado automáticamente cuando el módulo que contiene este servicio
   * se destruye (por ejemplo, al cerrar la aplicación).
   * 
   * Cierra la conexión activa con la base de datos para liberar recursos de forma segura.
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
