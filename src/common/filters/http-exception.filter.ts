import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : "Internal server error";

    const errorResponse =
      typeof message === "object"
        ? message
        : {
            statusCode: status,
            message,
            path: request.url,
          };

    if (process.env.NODE_ENV !== "production") {
      console.log(
        `[ERROR] ${request.method} ${request.url} → ${status} ${
          typeof message === "string" ? message : JSON.stringify(message)
        }`,
      );
    }

    response.status(status).json(errorResponse);
  }
}
