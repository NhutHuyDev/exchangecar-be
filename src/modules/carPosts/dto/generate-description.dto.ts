import { CarOrigin, CarStatus } from '@/modules/cars/entities/car.entity';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GenerateDescriptionDto {
  @IsString()
  @IsNotEmpty()
  car_brand: string;

  @IsString()
  @IsNotEmpty()
  car_model: string;

  @IsInt()
  @Type(() => Number)
  manufacturing_date: number;

  @IsString()
  @IsNotEmpty()
  body_type: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  car_mileage: number;

  @IsString()
  @IsNotEmpty()
  out_color: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  car_origin: CarOrigin;

  @IsString()
  @IsNotEmpty()
  car_status: CarStatus;

  @IsString()
  @IsNotEmpty()
  short_description: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  selling_price: number;

  @IsString()
  @IsNotEmpty()
  mobile_phone: string;
}
