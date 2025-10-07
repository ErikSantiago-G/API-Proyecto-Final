import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsBoolean, IsArray, IsOptional, IsUUID, Min } from "class-validator";

export class CreateProductDto {
  @ApiProperty({ example: "iPhone 14 Pro" })
  @IsString()
  name: string;

  @ApiProperty({ example: "iphone-14-pro" })
  @IsString()
  slug: string;

  @ApiProperty({
    example: "Latest iPhone model with advanced features",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 999.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({
    example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
  })
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiProperty({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: "uuid-of-category" })
  @IsUUID()
  categoryId: string;
}
