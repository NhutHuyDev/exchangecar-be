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
import { RequestResetPasswordDTO } from './dto/request-reset-password.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('request-verify-phone')
  @HttpCode(200)
  async requestVerifyPhone(
    @Body() requestVerifyPhoneDTO: RequestVerifyPhoneDTO,
  ) {
    return await this.authService.requestVerifyPhone(requestVerifyPhoneDTO);
  }

  @Post('sign-up')
  @HttpCode(201)
  async signUp(@Body() signUpDTO: SignUpDTO) {
    return await this.authService.signUp(signUpDTO);
  }

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @HttpCode(200)
  async signIn(@Req() request: RequestWithUser) {
    return await this.authService.signIn(request.user);
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() request: RequestWithUser) {
    return {
      access_token: this.authService.generateRefreshToken(request.user),
    };
  }

  @Post('request-reset-password')
  @HttpCode(200)
  async requestResetPassword(
    @Body() requestResetPasswordDTO: RequestResetPasswordDTO,
  ) {
    return await this.authService.requestResetPassword(requestResetPasswordDTO);
  }

  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() resetPasswordDTO: ResetPasswordDTO) {
    return await this.authService.resetPassword(resetPasswordDTO);
  }
}
