import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarBrand } from './entities/car_brand.entity';
import { CarVariantSpec } from './entities/car_variant_specs.entity';
import { CarsService } from './cars.service';
import { CarModel } from './entities/car_model.entity';
import { CarsController } from './cars.controller';
import { City } from '../customer/entities/city.entity';
import { District } from '../customer/entities/district.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CarBrand,
      CarModel,
      CarVariantSpec,
      City,
      District,
    ]),
  ],
  controllers: [CarsController],
  providers: [CarsService],
})
export class CarsModule {}
