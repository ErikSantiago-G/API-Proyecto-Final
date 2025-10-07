import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { NewsService } from "../services/news.service";
import { CreateNewsDto } from "../dto/create-news.dto";
import { UpdateNewsDto } from "../dto/update-news.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "@prisma/client";

@ApiTags("news")
@Controller("news")
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiOperation({ summary: "Get all news" })
  @ApiQuery({ name: "isActive", required: false, type: Boolean })
  findAll(@Query("isActive") isActive?: boolean) {
    return this.newsService.findAll(isActive);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get news by ID" })
  findOne(@Param("id") id: string) {
    return this.newsService.findOne(id);
  }

  @Get("slug/:slug")
  @ApiOperation({ summary: "Get news by slug" })
  findBySlug(@Param("slug") slug: string) {
    return this.newsService.findBySlug(slug);
  }
}

@ApiTags("admin/news")
@Controller("admin/news")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminNewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Create new news (Admin/Manager only)" })
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Update news (Admin/Manager only)" })
  update(@Param("id") id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, updateNewsDto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Delete news (Admin only)" })
  remove(@Param("id") id: string) {
    return this.newsService.remove(id);
  }
}
