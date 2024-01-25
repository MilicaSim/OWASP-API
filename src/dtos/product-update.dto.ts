import { IsBase64, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class ProductUpdateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsBase64()
  @IsNotEmpty()
  image: string;

  @IsOptional()
  @IsNumber()
  price: number;
}

