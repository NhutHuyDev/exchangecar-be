import { IsNotEmpty, IsPhoneNumber, Length } from 'class-validator';

export class RequestVerifyPhoneDTO {
  @Length(10)
  @IsPhoneNumber()
  @IsNotEmpty()
  readonly mobilePhone: string;
}
