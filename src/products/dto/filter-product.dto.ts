import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsNumber, IsString, IsBoolean, Min } from "class-validator";
import { Type } from "class-transformer";

export class FilterProductDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ example: "uuid-of-category" })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ example: "iPhone" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}
