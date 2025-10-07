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
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { FilterProductDto } from "./dto/filter-product.dto";
import { UpdateStockDto } from "./dto/update-stock.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "@prisma/client";

@ApiTags("products")
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: "Get all products with filters and pagination" })
  findAll(@Query() filterDto: FilterProductDto) {
    return this.productsService.findAll(filterDto);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get product by ID" })
  findOne(@Param("id") id: string) {
    return this.productsService.findOne(id);
  }

  @Get("slug/:slug")
  @ApiOperation({ summary: "Get product by slug" })
  findBySlug(@Param("slug") slug: string) {
    return this.productsService.findBySlug(slug);
  }
}

@ApiTags("admin/products")
@Controller("admin/products")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Create new product (Admin/Manager only)" })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Update product (Admin/Manager only)" })
  update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Patch(":id/stock")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Update product stock only (Admin/Manager only)" })
  updateStock(@Param("id") id: string, @Body() updateStockDto: UpdateStockDto) {
    return this.productsService.updateStock(id, updateStockDto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Delete product (Admin only)" })
  remove(@Param("id") id: string) {
    return this.productsService.remove(id);
  }
}
