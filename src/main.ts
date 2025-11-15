import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { json, raw } from "express";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";
import { NestFastifyApplication } from "@nestjs/platform-fastify";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule);

  app.use(helmet());
  app.enableCors();

  app.use("/webhooks/stripe", raw({ type: "application/json" }));

  app.use(json());

  // app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: false,
    }),
  );

  if (process.env.NODE_ENV !== "production") {
    const config = new DocumentBuilder()
      .setTitle("E-Commerce API")
      .setDescription(
        "Complete E-Commerce Backend with NestJS + TypeScript + PostgreSQL/Prisma + Stripe",
      )
      .setVersion("1.0")
      .addBearerAuth()
      .addTag("auth", "Authentication endpoints")
      .addTag("products", "Public product endpoints")
      .addTag("admin/products", "Admin product management")
      .addTag("categories", "Public category endpoints")
      .addTag("admin/categories", "Admin category management")
      .addTag("banners", "Public banner endpoints")
      .addTag("admin/banners", "Admin banner management")
      .addTag("sections", "Public section endpoints")
      .addTag("admin/sections", "Admin section management")
      .addTag("news", "Public news endpoints")
      .addTag("admin/news", "Admin news management")
      .addTag("cart", "Shopping cart endpoints")
      .addTag("checkout", "Checkout and payment endpoints")
      .addTag("orders", "User order endpoints")
      .addTag("admin/orders", "Admin order management")
      .addTag("webhooks", "Webhook endpoints")
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);
  }

  const port = 8000;
  await app.listen(port);
  console.warn(`Application is running on: http://localhost:${port}`);
  console.warn(`Swagger docs available at: http://localhost:${port}/api`);
}
bootstrap();
