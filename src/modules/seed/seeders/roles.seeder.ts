import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '@/modules/auth/entities/role.entity';
import { SeederInterface } from '../seeder.interface';
import { SystemRole } from '@/constraints/systemRoles.enum.constraint';

@Injectable()
export class RolesSeeder implements SeederInterface {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async seed() {
    const roles = Object.values(SystemRole).map((roleTitle) => {
      return this.roleRepository.create({ role_title: roleTitle });
    });

    await this.roleRepository.save(roles);
  }
}
