import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeederInterface } from '../seeder.interface';
import * as path from 'node:path';
import * as fs from 'fs';
import { CarBrand } from '@/modules/cars/entities/car_brand.entity';
import { CarModel } from '@/modules/cars/entities/car_model.entity';

@Injectable()
export class CarModelsSeeder implements SeederInterface {
  constructor(
    @InjectRepository(CarBrand)
    private readonly carBrandRepository: Repository<CarBrand>,
    @InjectRepository(CarModel)
    private readonly carModelRepository: Repository<CarModel>,
  ) {}

  async seed() {
    const brandModelsPath = path.join(
      __dirname,
      '../../../../data/brand_models.json',
    );

    const carBrands = await this.carBrandRepository.find();

    const brandModelsJson: { model_name: string; car_brand: string }[] =
      JSON.parse(fs.readFileSync(brandModelsPath, 'utf-8'));

    const carModels = brandModelsJson.map((carModel) => {
      return this.carModelRepository.create({
        model_name: carModel.model_name,
        car_brand: this.returnCarBrandOfModel(carBrands, carModel.car_brand),
      });
    });

    await this.carModelRepository.save(carModels);
  }

  returnCarBrandOfModel(carBrands: CarBrand[], brandToReturn: string) {
    for (const carBrand of carBrands) {
      if (carBrand.brand_name === brandToReturn) {
        return carBrand;
      }
    }

    throw new BadRequestException("car's brand is not supported");
  }
}
