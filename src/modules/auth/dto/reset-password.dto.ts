import { IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

export class ResetPasswordDTO {
  @IsPhoneNumber()
  @IsNotEmpty()
  readonly mobilePhone: string;

  @IsString()
  @Length(6)
  @IsNotEmpty()
  readonly newPassword: string;

  @IsString()
  @Length(6)
  @IsNotEmpty()
  readonly otp: string;
}
