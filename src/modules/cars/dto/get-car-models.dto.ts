import { IsNotEmpty, IsString } from 'class-validator';

export class GetCarModelDTO {
  @IsString()
  @IsNotEmpty()
  readonly brand_name: string;
}
