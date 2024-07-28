import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CustomerUpdateInformationDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  first_name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  about: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city_address: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  district_address: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  specific_address: string;
}
