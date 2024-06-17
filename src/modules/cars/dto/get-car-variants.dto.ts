import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class GetCarVariantDTO {
  @IsString()
  @IsNotEmpty()
  readonly model_name: string;

  @IsInt()
  readonly manufacturing_date: number;
}
