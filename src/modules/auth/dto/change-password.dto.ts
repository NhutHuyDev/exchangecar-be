import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ChangePasswordDTO {
  @IsString()
  @Length(6)
  @IsNotEmpty()
  readonly current_password: string;

  @IsString()
  @Length(6)
  @IsNotEmpty()
  readonly new_password: string;

  @IsString()
  @Length(6)
  @IsNotEmpty()
  readonly confirmed_password: string;
}
