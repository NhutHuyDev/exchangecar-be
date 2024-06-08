import { IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

export class SignInDTO {
  @IsPhoneNumber()
  @IsNotEmpty()
  readonly mobilePhone: string;

  @IsString()
  @Length(6)
  @IsNotEmpty()
  readonly password: string;
}
