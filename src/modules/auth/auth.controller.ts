import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RequestVerifyPhoneDTO } from './dto/request-verify-phone.dto';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/sign-up.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { RequestWithJwtPayload } from './interfaces/reqWithJwtPayload.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('request-verify-phone')
  @HttpCode(200)
  async requestVerifyPhone(
    @Body() requestVerifyPhoneDTO: RequestVerifyPhoneDTO,
  ) {
    return {
      data: await this.authService.requestVerifyPhone(requestVerifyPhoneDTO),
    };
  }

  @Post('sign-up')
  @HttpCode(201)
  async signUp(@Body() signUpDTO: SignUpDTO) {
    return {
      data: await this.authService.signUp(signUpDTO),
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  // @HttpCode(200)
  async signIn(@Req() request: RequestWithJwtPayload) {
    return {
      data: this.authService.signIn(request.user.jwtPayload),
    };
  }
}
