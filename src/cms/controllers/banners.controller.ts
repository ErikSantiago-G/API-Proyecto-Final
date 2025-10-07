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
import { BannersService } from "../services/banners.service";
import { CreateBannerDto } from "../dto/create-banner.dto";
import { UpdateBannerDto } from "../dto/update-banner.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "@prisma/client";

@ApiTags("banners")
@Controller("banners")
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  @ApiOperation({ summary: "Get all banners" })
  @ApiQuery({ name: "isActive", required: false, type: Boolean })
  findAll(@Query("isActive") isActive?: boolean) {
    return this.bannersService.findAll(isActive);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get banner by ID" })
  findOne(@Param("id") id: string) {
    return this.bannersService.findOne(id);
  }
}

@ApiTags("admin/banners")
@Controller("admin/banners")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminBannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Create new banner (Admin/Manager only)" })
  create(@Body() createBannerDto: CreateBannerDto) {
    return this.bannersService.create(createBannerDto);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Update banner (Admin/Manager only)" })
  update(@Param("id") id: string, @Body() updateBannerDto: UpdateBannerDto) {
    return this.bannersService.update(id, updateBannerDto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Delete banner (Admin only)" })
  remove(@Param("id") id: string) {
    return this.bannersService.remove(id);
  }
}
