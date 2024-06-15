import { TypeOrmModule } from '@nestjs/typeorm';
import postgres from '../../configs/postgres.config';
import { SeedService } from './seed.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Role } from '../auth/entities/role.entity';
import { RolesSeeder } from './seeders/roles.seeder';
import { AuthCredential } from '../auth/entities/auth_credential.entity';
import { Staff } from '../staffs/entities/staff.entity';
import { AdminSeeder } from './seeders/admin.seeder';
import { CarBrand } from '../cars/entities/car_brand.entity';
import { CarBrandsSeeder } from './seeders/carBrands.seeder';
import { CarModel } from '../cars/entities/car_model.entity';
import { CarModelsSeeder } from './seeders/carModels.seeder';
import { CarVariantSpec } from '../cars/entities/Car_Variant_Specs.entity';
import { CarVariantSpecsSeeder } from './seeders/carVariantSpecs.seeder';
import { City } from '../customer/entities/city.entity';
import { District } from '../customer/entities/district.entity';
import { CitiesSeeder } from './seeders/cities.seeder';
import { CarAttribute } from '../cars/entities/car_attribute.entity';
import { CarAttributeOption } from '../cars/entities/car_attribute_option.entity';
import { CarAttributesSeeder } from './seeders/carAttributes.seeder';
import { CarAttributeOptionsSeeder } from './seeders/carAttributeOptions.seeder';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [postgres],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('postgres'),
    }),
    TypeOrmModule.forFeature([
      Role,
      AuthCredential,
      Staff,
      CarBrand,
      CarModel,
      CarVariantSpec,
      City,
      District,
      CarAttribute,
      CarAttributeOption,
    ]),
  ],
  controllers: [],
  providers: [
    SeedService,
    RolesSeeder,
    AdminSeeder,
    CarBrandsSeeder,
    CarModelsSeeder,
    CarVariantSpecsSeeder,
    CitiesSeeder,
    CarAttributesSeeder,
    CarAttributeOptionsSeeder,
  ],
})
export class SeedModule {}
