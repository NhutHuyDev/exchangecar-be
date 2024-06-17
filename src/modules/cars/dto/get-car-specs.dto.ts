import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class GetCarSpecsDTO {
  @IsString()
  @IsNotEmpty()
  readonly variant_name: string;

  @IsInt()
  readonly manufacturing_date: number;
}
