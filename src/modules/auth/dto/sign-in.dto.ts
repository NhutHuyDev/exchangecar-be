import { IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

export class SignInDTO {
  @IsPhoneNumber()
  @IsNotEmpty()
  readonly mobile_phone: string;

  @IsString()
  @Length(6)
  @IsNotEmpty()
  readonly password: string;
}
