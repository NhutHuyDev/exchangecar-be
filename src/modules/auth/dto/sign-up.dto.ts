import {
  IsNotEmpty,
  IsNumberString,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class SignUpDTO {
  @IsPhoneNumber()
  @IsNotEmpty()
  readonly mobilePhone: string;

  @IsString()
  @Length(3)
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @Length(3)
  @IsNotEmpty()
  readonly lastName: string;

  @IsString()
  @Length(6)
  @IsNotEmpty()
  readonly password: string;

  @IsNumberString()
  @Length(6, 6, { message: 'Mobile phone must be exactly 6 characters long' })
  @IsNotEmpty()
  readonly verifyOTP: string;
}
