import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/jwtPayload.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'mobilePhone' });
  }

  async validate(mobilePhone: string, password: string) {
    const user = await this.authService.getAuthenticatedUser(
      mobilePhone,
      password,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    const jwtPayload: JwtPayload = {
      userId: user.id,
    };

    return {
      jwtPayload,
    };
  }
}
