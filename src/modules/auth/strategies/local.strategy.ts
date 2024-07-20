import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/jwtPayload.interface';
import SystemRole from '@/constraints/systemRoles.enum.constraint';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'mobile_phone' });
  }

  async validate(mobile_phone: string, password: string) {
    const authCredential = await this.authService.getAuthenticationWithRole(
      mobile_phone,
      password,
    );

    if (!authCredential) {
      throw new UnauthorizedException();
    }

    const roles: SystemRole[] = authCredential.roles.map(
      (role) => role.role_title,
    );

    const jwtPayload: JwtPayload = {
      authId: authCredential.id,
      roles: roles,
    };

    return jwtPayload;
  }
}
