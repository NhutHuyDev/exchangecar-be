import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreatePayment {
  @IsString()
  @IsNotEmpty()
  order_id: string;

  @IsString()
  order_info: string;

  @IsNumberString()
  @IsNotEmpty()
  amount: number;
}
