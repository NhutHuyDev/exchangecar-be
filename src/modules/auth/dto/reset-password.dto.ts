import { IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

export class ResetPasswordDTO {
  @IsPhoneNumber()
  @IsNotEmpty()
  readonly mobile_phone: string;

  @IsString()
  @Length(6)
  @IsNotEmpty()
  readonly new_password: string;

  @IsString()
  @Length(6)
  @IsNotEmpty()
  readonly confirmed_password: string;

  @IsString()
  @Length(6)
  @IsNotEmpty()
  readonly otp: string;
}
