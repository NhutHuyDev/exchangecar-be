import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerifyOTP } from './entities/verify_otp.entity';
import { Customer } from 'src/modules/users/entities/customer.entity';
import { AuthCredential } from './entities/auth_credential.entity';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { Role } from './entities/role.entity';
// import { JwtAccessTokenStrategy } from './strategies/jwt-access-token.stategy';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([VerifyOTP, Customer, AuthCredential, Role]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
