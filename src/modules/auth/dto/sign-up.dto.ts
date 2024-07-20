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
  readonly mobile_phone: string;

  @IsString()
  @Length(3)
  @IsNotEmpty()
  readonly first_name: string;

  @IsString()
  @Length(3)
  @IsNotEmpty()
  readonly last_name: string;

  @IsString()
  @Length(6)
  @IsNotEmpty()
  readonly password: string;

  @IsNumberString()
  @Length(6, 6, { message: 'Mobile phone must be exactly 6 characters long' })
  @IsNotEmpty()
  readonly verify_otp: string;
}
