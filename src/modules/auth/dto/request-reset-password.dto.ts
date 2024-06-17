import { IsNotEmpty, IsPhoneNumber, Length } from 'class-validator';

export class RequestResetPasswordDTO {
  @Length(10)
  @IsPhoneNumber()
  @IsNotEmpty()
  readonly mobilePhone: string;
}
