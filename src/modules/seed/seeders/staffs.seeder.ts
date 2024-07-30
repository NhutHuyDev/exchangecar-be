import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '@/modules/auth/entities/role.entity';
import { SeederInterface } from '../seeder.interface';
import { Staff } from '@/modules/staffs/entities/staff.entity';
import { AuthCredential } from '@/modules/auth/entities/auth_credential.entity';
import SystemRole from '@/constraints/systemRoles.enum.constraint';
import { hash } from '@/utils/hash.util';
import * as path from 'node:path';
import * as fs from 'fs';

@Injectable()
export class StaffsSeeder implements SeederInterface {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(AuthCredential)
    private readonly authCredentialRepository: Repository<AuthCredential>,
  ) {}

  async seed() {
    const staffRole = await this.roleRepository.findOne({
      where: {
        role_title: SystemRole.Staff,
      },
    });

    if (!staffRole) {
      throw new Error('Staff role not found in the database');
    }

    const staffsPath = path.join(
      __dirname,
      '../../../../data/mock_staffs.json',
    );

    const staffsJson: {
      first_name: string;
      last_name: string;
      mobile_phone: string;
      email: string;
      password: string;
    }[] = JSON.parse(fs.readFileSync(staffsPath, 'utf-8'));

    for (const staffInfo of staffsJson) {
      const authCredential = await this.authCredentialRepository.save({
        cred_login: staffInfo.mobile_phone,
        cred_password: hash(staffInfo.password),
        roles: [staffRole],
      });

      await this.staffRepository.save({
        first_name: staffInfo.first_name,
        last_name: staffInfo.last_name,
        mobile_phone: staffInfo.mobile_phone,
        email: staffInfo.email,
        roles: [staffRole],
        auth_credential: authCredential,
      });
    }
  }
}
