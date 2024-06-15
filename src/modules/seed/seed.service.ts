import { Injectable, Logger } from '@nestjs/common';
import { SeederInterface } from './seeder.interface';
import { AdminSeeder } from './seeders/admin.seeder';
import { RolesSeeder } from './seeders/roles.seeder';
import { CarBrandsSeeder } from './seeders/carBrands.seeder';
import { CarModelsSeeder } from './seeders/carModels.seeder';
import { CarVariantSpecsSeeder } from './seeders/carVariantSpecs.seeder';
import { CitiesSeeder } from './seeders/cities.seeder';
import { CarAttributesSeeder } from './seeders/carAttributes.seeder';
import { CarAttributeOptionsSeeder } from './seeders/carAttributeOptions.seeder';

@Injectable()
export class SeedService {
  private readonly seeders: SeederInterface[] = [];
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly rolesSeeder: RolesSeeder,
    private readonly adminSeeder: AdminSeeder,
    private readonly carBrandsSeeder: CarBrandsSeeder,
    private readonly carModelsSeeder: CarModelsSeeder,
    private readonly carVariantSpecsSeeder: CarVariantSpecsSeeder,
    private readonly citiesSeeder: CitiesSeeder,
    private readonly carAttributesSeeder: CarAttributesSeeder,
    private readonly carAttributeOptionsSeeder: CarAttributeOptionsSeeder,
  ) {
    this.seeders = [carAttributesSeeder, carAttributeOptionsSeeder];
  }

  async seed() {
    for (const seeder of this.seeders) {
      this.logger.log(`Seeding ${seeder.constructor.name}`);
      await seeder.seed();
    }
  }
}
