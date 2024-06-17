import SortOptions from '@/constraints/sortOptions.constaint';
import { IsRangeQuery } from '@/validators/IsRangeQuery.validator';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CarPostQueryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  car_brand?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  car_model?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;

  @IsOptional()
  @IsRangeQuery()
  @IsNotEmpty()
  manufacturing_date?: string;

  @IsOptional()
  @IsRangeQuery()
  @IsNotEmpty()
  selling_price?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  car_origin?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  car_status?: string;

  @IsOptional()
  @IsRangeQuery()
  @IsNotEmpty()
  car_mileage?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  transmission?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  drivetrain?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  engine_type?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  body_type?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  out_color?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  total_seating?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  total_doors?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  search?: string;

  @IsOptional()
  @IsEnum(SortOptions)
  @IsNotEmpty()
  order_by?: SortOptions = SortOptions.DES_POSTED_DATE;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;
}
