import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCheckoutDto {
  @ApiProperty({ example: "123 Main St, City, Country" })
  @IsString()
  shippingAddress: string;

  @ApiProperty({ example: "http://localhost:3000/success" })
  @IsString()
  successUrl: string;

  @ApiProperty({ example: "http://localhost:3000/cancel" })
  @IsString()
  cancelUrl: string;
}
