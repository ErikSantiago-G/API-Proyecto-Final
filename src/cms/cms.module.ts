import { Module } from "@nestjs/common";
import { BannersService } from "./services/banners.service";
import { SectionsService } from "./services/sections.service";
import { NewsService } from "./services/news.service";
import { BannersController, AdminBannersController } from "./controllers/banners.controller";
import { SectionsController, AdminSectionsController } from "./controllers/sections.controller";
import { NewsController, AdminNewsController } from "./controllers/news.controller";

@Module({
  controllers: [
    BannersController,
    AdminBannersController,
    SectionsController,
    AdminSectionsController,
    NewsController,
    AdminNewsController,
  ],
  providers: [BannersService, SectionsService, NewsService],
})
export class CmsModule {}
