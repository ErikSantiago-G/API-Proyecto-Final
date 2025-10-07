import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsBoolean, IsNumber, IsOptional } from "class-validator";

export class CreateBannerDto {
  @ApiProperty({ example: "Summer Sale" })
  @IsString()
  title: string;

  @ApiProperty({
    example: "Get up to 50% off on selected items",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: "https://example.com/banner-image.jpg" })
  @IsString()
  imageUrl: string;

  @ApiProperty({ example: "/products/sale", required: false })
  @IsOptional()
  @IsString()
  linkUrl?: string;

  @ApiProperty({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 1, default: 0 })
  @IsOptional()
  @IsNumber()
  order?: number;
}
