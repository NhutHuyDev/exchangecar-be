import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePayment {
  @IsNumber()
  @IsNotEmpty()
  post_id: number;

  @IsString()
  @IsNotEmpty()
  car_slug: string;

  @IsString()
  order_info: string;

  @IsNumber()
  @IsNotEmpty()
  days_publish: number;
}
