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
import { SectionsService } from "../services/sections.service";
import { CreateSectionDto } from "../dto/create-section.dto";
import { UpdateSectionDto } from "../dto/update-section.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "@prisma/client";

@ApiTags("sections")
@Controller("sections")
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Get()
  @ApiOperation({ summary: "Get all sections" })
  @ApiQuery({ name: "isActive", required: false, type: Boolean })
  findAll(@Query("isActive") isActive?: boolean) {
    return this.sectionsService.findAll(isActive);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get section by ID" })
  findOne(@Param("id") id: string) {
    return this.sectionsService.findOne(id);
  }
}

@ApiTags("admin/sections")
@Controller("admin/sections")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminSectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Create new section (Admin/Manager only)" })
  create(@Body() createSectionDto: CreateSectionDto) {
    return this.sectionsService.create(createSectionDto);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Update section (Admin/Manager only)" })
  update(@Param("id") id: string, @Body() updateSectionDto: UpdateSectionDto) {
    return this.sectionsService.update(id, updateSectionDto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Delete section (Admin only)" })
  remove(@Param("id") id: string) {
    return this.sectionsService.remove(id);
  }
}
