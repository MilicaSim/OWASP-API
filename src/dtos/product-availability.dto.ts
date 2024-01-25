import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class ProductAvailabilityDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsBoolean()
  isActive: boolean;
}
  