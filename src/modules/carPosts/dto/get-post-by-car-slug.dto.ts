import { IsNotEmpty, IsString } from 'class-validator';

export class GetPostByCarSlugDto {
  @IsString()
  @IsNotEmpty()
  slug: string;
}
