import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarBrand } from './entities/car_brand.entity';
import { CarVariantSpec } from './entities/car_variant_specs.entity';
import { CarsService } from './cars.service';
import { CarModel } from './entities/car_model.entity';
import { CarsController } from './cars.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CarBrand, CarModel, CarVariantSpec])],
  controllers: [CarsController],
  providers: [CarsService],
})
export class CarsModule {}
