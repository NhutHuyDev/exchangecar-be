import { Injectable, Logger } from '@nestjs/common';
import { SeederInterface } from './seeder.interface';
import { AdminSeeder } from './seeders/admin.seeder';
import { RolesSeeder } from './seeders/roles.seeder';

@Injectable()
export class SeedService {
  private readonly seeders: SeederInterface[] = [];
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly rolesSeeder: RolesSeeder,
    private readonly adminSeeder: AdminSeeder,
  ) {
    this.seeders = [rolesSeeder, adminSeeder];
  }

  async seed() {
    for (const seeder of this.seeders) {
      this.logger.log(`Seeding ${seeder.constructor.name}`);
      await seeder.seed();
    }
  }
}
