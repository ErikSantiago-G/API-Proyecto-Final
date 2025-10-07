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
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "@prisma/client";

@ApiTags("categories")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: "Get all categories" })
  @ApiQuery({ name: "isActive", required: false, type: Boolean })
  findAll(@Query("isActive") isActive?: boolean) {
    return this.categoriesService.findAll(isActive);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get category by ID" })
  findOne(@Param("id") id: string) {
    return this.categoriesService.findOne(id);
  }

  @Get("slug/:slug")
  @ApiOperation({ summary: "Get category by slug" })
  findBySlug(@Param("slug") slug: string) {
    return this.categoriesService.findBySlug(slug);
  }
}

@ApiTags("admin/categories")
@Controller("admin/categories")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Create new category (Admin/Manager only)" })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Update category (Admin/Manager only)" })
  update(@Param("id") id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Delete category (Admin only)" })
  remove(@Param("id") id: string) {
    return this.categoriesService.remove(id);
  }
}
