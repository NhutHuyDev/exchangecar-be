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
import { RequestWithUser } from '@/types/requests.type';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';

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
  @HttpCode(200)
  async signIn(@Req() request: RequestWithUser) {
    return {
      data: await this.authService.signIn(request.user),
    };
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() request: RequestWithUser) {
    return {
      accessToken: this.authService.generateRefreshToken(request.user),
    };
  }
}
