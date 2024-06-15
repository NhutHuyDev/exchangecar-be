import { FiltersService } from './filters.service';
import { FiltersController } from './filters.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarBrand } from '../cars/entities/car_brand.entity';
import { CarModel } from '../cars/entities/car_model.entity';
import { City } from '../customer/entities/city.entity';
import { CarAttributeOption } from '../cars/entities/car_attribute_option.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CarBrand, CarModel, City, CarAttributeOption]),
  ],
  controllers: [FiltersController],
  providers: [FiltersService],
})
export class FiltersModule {}
