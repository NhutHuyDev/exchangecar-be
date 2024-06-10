import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RequestVerifyPhoneDTO } from './dto/request-verify-phone.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, MoreThanOrEqual, Repository } from 'typeorm';
import { VerifyOTP, VerifyType } from './entities/verify_otp.entity';
import generateOTP from 'src/utils/generateOTP';
import { Customer } from 'src/modules/users/entities/customer.entity';
import { SignUpDTO } from './dto/sign-up.dto';
import { AuthCredential } from './entities/auth_credential.entity';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwtPayload.interface';
import { Role } from './entities/role.entity';

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
    private dataSource: DataSource,
    private jwtService: JwtService,
  ) {}

  async requestVerifyPhone(requestVerifyPhoneDTO: RequestVerifyPhoneDTO) {
    const { mobilePhone } = requestVerifyPhoneDTO;

    const isUsedPhoneNumber = await this.customerRepository.findOneBy({
      mobile_phone: mobilePhone,
    });

    if (isUsedPhoneNumber) {
      throw new BadRequestException('phone number is used');
    }

    let currentVerify = await this.verifyOTPRepository.findOneBy({
      verify_type: VerifyType.PHONE,
      verify_info: mobilePhone,
    });

    const newOTP = generateOTP(6);
    const expiry = new Date(
      Date.now() + parseInt(process.env.OTP_EXPIRY_DURATION, 10),
    );

    if (currentVerify) {
      currentVerify.current_otp = await bcrypt.hash(newOTP, 10);
      currentVerify.otp_expiry = expiry;
    } else {
      currentVerify = new VerifyOTP();
      currentVerify.verify_type = VerifyType.PHONE;
      currentVerify.verify_info = mobilePhone;
      currentVerify.current_otp = await bcrypt.hash(newOTP, 10);
      currentVerify.otp_expiry = expiry;
    }

    await this.verifyOTPRepository.save(currentVerify);

    return {
      mobilePhone: mobilePhone,
      currentOTP: newOTP,
    };
  }

  async signUp(signUpDTO: SignUpDTO) {
    const { firstName, lastName, mobilePhone, password, verifyOTP } = signUpDTO;

    const isUsedPhoneNumber = await this.customerRepository.findOneBy({
      mobile_phone: mobilePhone,
    });

    if (isUsedPhoneNumber) {
      throw new BadRequestException('phone number is used');
    }

    const infoOTP = await this.verifyOTPRepository.findOneBy({
      verify_type: VerifyType.PHONE,
      verify_info: mobilePhone,
      otp_expiry: MoreThanOrEqual(new Date()),
    });

    if (!infoOTP) {
      throw new BadRequestException('phone number is not verified');
    }

    const isValidOTP = await bcrypt.compare(verifyOTP, infoOTP.current_otp);

    if (isValidOTP === false) {
      throw new BadRequestException('otp is not valid');
    }

    return await this.dataSource.transaction(async (manager) => {
      const authCredential = await manager.save(AuthCredential, {
        cred_login: mobilePhone,
        cred_password: await bcrypt.hash(password, 10),
      });

      const newCustomer = await manager.save(Customer, {
        first_name: firstName,
        last_name: lastName,
        auth_credential: authCredential,
        mobile_phone: mobilePhone,
      });

      return { newCustomer: plainToClass(Customer, newCustomer) };
    });
  }

  signIn(jwtPayload: JwtPayload) {
    const accessToken = this.generateAccessToken(jwtPayload);
    const refreshToken = this.generateRefreshToken(jwtPayload);

    return {
      accessToken,
      refreshToken,
    };
  }

  async getAuthenticatedUser(mobilePhone: string, password: string) {
    const currentUser = await this.customerRepository.findOne({
      where: { mobile_phone: mobilePhone },
      relations: { auth_credential: true },
    });

    if (!currentUser) {
      throw new UnauthorizedException('mobilePhone or password is not correct');
    }

    const isCorrectPassword = await bcrypt.compare(
      password,
      currentUser.auth_credential.cred_password,
    );

    if (isCorrectPassword === false) {
      throw new UnauthorizedException('mobilePhone or password is not correct');
    }

    return plainToClass(Customer, currentUser);
  }

  generateAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: 'access_token_secret',
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    });
  }

  generateRefreshToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: 'refresh_token_secret',
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    });
  }
}
