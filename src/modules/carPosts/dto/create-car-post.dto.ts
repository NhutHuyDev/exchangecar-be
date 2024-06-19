import { CarOrigin, CarStatus } from '@/modules/cars/entities/car.entity';
import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCarPostDto {
  @IsString()
  @IsNotEmpty()
  car_brand: string;

  @IsString()
  @IsNotEmpty()
  car_model: string;

  @IsString()
  @IsNotEmpty()
  car_variant: string;

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
  transmission: string;

  @IsString()
  @IsNotEmpty()
  drivetrain: string;

  @IsString()
  @IsNotEmpty()
  engine_type: string;

  @IsString()
  @IsNotEmpty()
  out_color: string;

  @IsInt()
  @Type(() => Number)
  total_seating: number;

  @IsInt()
  @Type(() => Number)
  total_doors: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @Optional()
  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsNotEmpty()
  car_origin: CarOrigin;

  @IsString()
  @IsNotEmpty()
  car_status: CarStatus;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  selling_price: number;
}
