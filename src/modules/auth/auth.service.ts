import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RequestVerifyPhoneDTO } from './dto/request-verify-phone.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, MoreThanOrEqual, Repository } from 'typeorm';
import { VerifyOTP, VerifyType } from './entities/verify_otp.entity';
import generateOTP from '@/utils/generateOTP.util';
import { Customer } from '@/modules/customer/entities/customer.entity';
import { SignUpDTO } from './dto/sign-up.dto';
import { AuthCredential } from './entities/auth_credential.entity';
import { plainToClass } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwtPayload.interface';
import { Role } from './entities/role.entity';
import { CustomerWishlist } from '../customer/entities/customer_wishlist.entity';
import { compare, hash } from '@/utils/hash.util';
import SystemRole from '@/constraints/systemRoles.enum.constraint';
import { Session } from './entities/session.entity';
import {
  access_token_private_key,
  refresh_token_private_key,
} from '@/constraints/jwt.constraint';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { Twilio } from 'twilio';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Role)
    private RoleRepository: Repository<Role>,
    @InjectRepository(VerifyOTP)
    private verifyOTPRepository: Repository<VerifyOTP>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(AuthCredential)
    private authCredentialRepository: Repository<AuthCredential>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    private dataSource: DataSource,
    private jwtService: JwtService,
  ) {}

  async signIn(jwtPayload: JwtPayload) {
    const accessToken = this.generateAccessToken(jwtPayload);
    const refreshToken = this.generateRefreshToken(jwtPayload);

    await this.storeRefreshToken(jwtPayload.authId, refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async requestVerifyPhone(requestVerifyPhoneDTO: RequestVerifyPhoneDTO) {
    const { mobile_phone } = requestVerifyPhoneDTO;

    const isUsedPhoneNumber = await this.customerRepository.findOneBy({
      mobile_phone: mobile_phone,
    });

    if (isUsedPhoneNumber) {
      throw new BadRequestException('phone number is used');
    }

    let currentVerify = await this.verifyOTPRepository.findOneBy({
      verify_type: VerifyType.PHONE,
      verify_info: mobile_phone,
    });

    const newOTP = generateOTP(6);
    const expiry = new Date(
      Date.now() + parseInt(process.env.OTP_EXPIRY_DURATION, 10),
    );

    if (currentVerify) {
      currentVerify.current_otp = hash(newOTP);
      currentVerify.otp_expiry = expiry;
    } else {
      currentVerify = new VerifyOTP();
      currentVerify.verify_type = VerifyType.PHONE;
      currentVerify.verify_info = mobile_phone;
      currentVerify.current_otp = hash(newOTP);
      currentVerify.otp_expiry = expiry;
    }

    await this.verifyOTPRepository.save(currentVerify);

    const twilioClient = new Twilio(
      process.env.TWILIO_SID,
      process.env.TWILIO_AUTH_TOKEn,
    );

    await twilioClient.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobile_phone,
      body: `your OTP to create account on ExchangeCar: ${newOTP}`,
    });

    return {
      mobile_phone: mobile_phone,
    };
  }

  async signUp(signUpDTO: SignUpDTO) {
    const { first_name, last_name, mobile_phone, password, verify_otp } =
      signUpDTO;

    const isUsedPhoneNumber = await this.customerRepository.findOneBy({
      mobile_phone: mobile_phone,
    });

    if (isUsedPhoneNumber) {
      throw new BadRequestException('phone number is used');
    }

    const infoOTP = await this.verifyOTPRepository.findOneBy({
      verify_type: VerifyType.PHONE,
      verify_info: mobile_phone,
      otp_expiry: MoreThanOrEqual(new Date()),
    });

    if (!infoOTP) {
      throw new BadRequestException('phone number is not verified');
    }

    const isValidOTP = compare(verify_otp, infoOTP.current_otp);

    if (isValidOTP === false) {
      throw new BadRequestException('otp is not valid');
    }

    return await this.dataSource.transaction(async (manager) => {
      const individualCustomerRole = await this.RoleRepository.findOneBy({
        role_title: SystemRole.Individual_Customer,
      });

      const authCredential = await manager.save(AuthCredential, {
        cred_login: mobile_phone,
        cred_password: hash(password),
        roles: [individualCustomerRole],
      });

      const newCustomer = await manager.save(Customer, {
        first_name: first_name,
        last_name: last_name,
        auth_credential: authCredential,
        mobile_phone: mobile_phone,
      });

      await manager.save(CustomerWishlist, {
        customer: newCustomer,
      });

      return { customer: plainToClass(Customer, newCustomer) };
    });
  }

  async requestResetPassword(requestResetPasswordDTO: RequestVerifyPhoneDTO) {
    const { mobile_phone } = requestResetPasswordDTO;
    const authCredential = await this.authCredentialRepository.findOneBy({
      cred_login: mobile_phone,
    });

    if (!authCredential) {
      throw new BadRequestException('mobile phone is not existed');
    }

    const newOTP = generateOTP(6);

    authCredential.password_reset_otp = hash(newOTP);
    authCredential.password_reset_expiry = new Date(
      Date.now() + parseInt(process.env.OTP_EXPIRY_DURATION, 10),
    );

    await this.authCredentialRepository.save(authCredential);

    const twilioClient = new Twilio(
      process.env.TWILIO_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );

    await twilioClient.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobile_phone,
      body: `your OTP to reset your password on ExchangeCar: ${newOTP}`,
    });

    return {
      mobile_phone: mobile_phone,
    };
  }

  async resetPassword(resetPasswordDTO: ResetPasswordDTO) {
    const { mobile_phone, new_password, confirmed_password, otp } =
      resetPasswordDTO;
    const authCredential = await this.authCredentialRepository.findOneBy({
      cred_login: mobile_phone,
    });

    if (!authCredential) {
      throw new BadRequestException('mobile phone is not existed');
    }

    if (
      authCredential.password_reset_expiry &&
      authCredential.password_reset_expiry > new Date()
    ) {
      if (compare(otp, authCredential.password_reset_otp)) {
        if (confirmed_password === new_password) {
          authCredential.cred_password = hash(new_password);
          authCredential.password_reset_otp = null;
          authCredential.password_reset_expiry = null;

          this.authCredentialRepository.save(authCredential);

          return {
            message: 'reset password successfully',
          };
        } else {
          throw new BadRequestException('confirm password is not matched');
        }
      }
    }

    throw new BadRequestException('invalid otp');
  }

  async changePassword(user: JwtPayload, changePasswordDTO: ChangePasswordDTO) {
    const { authId } = user;
    const { current_password, confirmed_password, new_password } =
      changePasswordDTO;

    const authCredential = await this.authCredentialRepository.findOneBy({
      id: authId,
    });

    if (compare(current_password, authCredential.cred_password)) {
      if (confirmed_password === new_password) {
        authCredential.cred_password = hash(new_password);
        await this.authCredentialRepository.save(authCredential);

        return { message: 'change password successfully' };
      } else {
        throw new BadRequestException('confirm password is not matched');
      }
    } else {
      throw new UnauthorizedException();
    }
  }

  async getAuthentication(mobilePhone: string, password: string) {
    const authCredential = await this.authCredentialRepository.findOne({
      where: { cred_login: mobilePhone },
    });

    if (!authCredential) {
      throw new UnauthorizedException('mobilePhone or password is not correct');
    }

    const isCorrectPassword = compare(password, authCredential.cred_password);

    if (isCorrectPassword === false) {
      throw new UnauthorizedException('mobilePhone or password is not correct');
    }

    return plainToClass(AuthCredential, authCredential);
  }

  async getAuthenticationWithRole(mobilePhone: string, password: string) {
    const authCredential = await this.authCredentialRepository.findOne({
      where: { cred_login: mobilePhone },
      relations: {
        roles: true,
      },
    });

    if (!authCredential) {
      throw new UnauthorizedException('mobilePhone or password is not correct');
    }

    const isCorrectPassword = compare(password, authCredential.cred_password);

    if (isCorrectPassword === false) {
      throw new UnauthorizedException('mobilePhone or password is not correct');
    }

    return plainToClass(AuthCredential, authCredential);
  }

  generateAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      algorithm: 'RS256',
      privateKey: access_token_private_key,
      expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}s`,
    });
  }

  generateRefreshToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      algorithm: 'RS256',
      privateKey: refresh_token_private_key,
      expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}s`,
    });
  }

  async storeRefreshToken(authId: number, refreshToken: string) {
    const authCredential = await this.authCredentialRepository.findOneBy({
      id: authId,
    });

    await this.sessionRepository.save({
      auth_credential: authCredential,
      refresh_token: hash(refreshToken),
    });
  }

  async getAuthIfRefreshTokenMatched(
    authId: number,
    refreshToken: string,
  ): Promise<JwtPayload> {
    const authCredential = await this.authCredentialRepository.findOne({
      where: {
        id: authId,
      },
      relations: {
        roles: true,
      },
    });

    if (!authCredential) {
      throw new UnauthorizedException();
    }

    const session = await this.sessionRepository.findOneBy({
      auth_credential: authCredential,
      refresh_token: hash(refreshToken),
      is_available: true,
    });

    if (!session) {
      throw new UnauthorizedException();
    }

    const roles: SystemRole[] = authCredential.roles.map(
      (role) => role.role_title,
    );

    return {
      authId: authCredential.id,
      roles: roles,
    };
  }
}
