import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsBoolean, IsNumber, IsOptional } from "class-validator";

export class CreateSectionDto {
  @ApiProperty({ example: "About Us" })
  @IsString()
  title: string;

  @ApiProperty({ example: "Learn more about our company", required: false })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({
    example: "We are a leading e-commerce platform...",
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    example: "https://example.com/section-image.jpg",
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 1, default: 0 })
  @IsOptional()
  @IsNumber()
  order?: number;
}
