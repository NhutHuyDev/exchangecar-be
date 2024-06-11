import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeederInterface } from '../seeder.interface';
import * as path from 'node:path';
import * as fs from 'fs';
import { CarBrand } from '@/modules/cars/entities/car_brand.entity';

@Injectable()
export class CarBrandsSeeder implements SeederInterface {
  constructor(
    @InjectRepository(CarBrand)
    private readonly carBrandRepository: Repository<CarBrand>,
  ) {}

  async seed() {
    const carBrandPath = path.join(
      __dirname,
      '../../../../data/car_brands.json',
    );

    const carBrandJson: CarBrand[] = JSON.parse(
      fs.readFileSync(carBrandPath, 'utf-8'),
    );

    const carBrands = carBrandJson.map((carBrand) => {
      return this.carBrandRepository.create({
        brand_name: carBrand.brand_name,
        brand_url: carBrand.brand_url,
      });
    });

    await this.carBrandRepository.save(carBrands);
  }
}
