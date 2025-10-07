import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsBoolean, IsOptional } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({ example: "Electronics" })
  @IsString()
  name: string;

  @ApiProperty({ example: "electronics" })
  @IsString()
  slug: string;

  @ApiProperty({ example: "All electronic devices", required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: "https://example.com/category-image.jpg",
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
