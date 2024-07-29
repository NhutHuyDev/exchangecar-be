import { CarOrigin, CarStatus } from '@/modules/cars/entities/car.entity';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCarPostDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  car_brand: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  car_model: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  car_variant: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  manufacturing_date: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  body_type: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  car_mileage: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  transmission: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  drivetrain: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  engine_type: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  out_color: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  total_seating: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  total_doors: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  district: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  car_origin: CarOrigin;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  car_status: CarStatus;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  selling_price: number;
}
