import { IsNumberString } from 'class-validator';

export class GetPostsByCustomerDto {
  @IsNumberString()
  customer_id: number;
}
