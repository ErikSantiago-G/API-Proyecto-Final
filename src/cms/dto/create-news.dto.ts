import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsBoolean, IsDateString, IsOptional } from "class-validator";

export class CreateNewsDto {
  @ApiProperty({ example: "New Product Launch" })
  @IsString()
  title: string;

  @ApiProperty({ example: "new-product-launch" })
  @IsString()
  slug: string;

  @ApiProperty({ example: "We are excited to announce our latest product..." })
  @IsString()
  content: string;

  @ApiProperty({ example: "Short summary of the news", required: false })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiProperty({
    example: "https://example.com/news-image.jpg",
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: "2025-01-01T00:00:00Z", required: false })
  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}
