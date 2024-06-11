import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '@/modules/auth/entities/role.entity';
import { SeederInterface } from '../seeder.interface';
import { Staff } from '@/modules/staffs/entities/staff.entity';
import { AuthCredential } from '@/modules/auth/entities/auth_credential.entity';
import { SystemRole } from '@/constraints/systemRoles.enum.constraint';
import { hash } from '@/utils/hash.util';

@Injectable()
export class AdminSeeder implements SeederInterface {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(AuthCredential)
    private readonly authCredentialRepository: Repository<AuthCredential>,
  ) {}

  async seed() {
    const adminRole = await this.roleRepository.findOne({
      where: {
        role_title: SystemRole.Admin,
      },
    });

    if (!adminRole) {
      throw new Error('Admin role not found in the database');
    }

    const authCredential = await this.authCredentialRepository.save({
      cred_login: process.env.ADMIN_PHONE_NUMBER,
      cred_password: hash(process.env.ADMIN_PASSWORD),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const staff = await this.staffRepository.save({
      first_name: process.env.ADMIN_FIRST_NAME,
      last_name: process.env.ADMIN_LAST_NAME,
      mobile_phone: process.env.ADMIN_PHONE_NUMBER,
      email: process.env.ADMIN_EMAIL,
      roles: [adminRole],
      auth_credential: authCredential,
    });
  }
}
