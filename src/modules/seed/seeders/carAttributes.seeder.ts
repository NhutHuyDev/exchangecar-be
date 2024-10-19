import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeederInterface } from '../seeder.interface';
import * as path from 'node:path';
import * as fs from 'fs';
import { CarAttribute } from '@/modules/cars/entities/car_attribute.entity';

@Injectable()
export class CarAttributesSeeder implements SeederInterface {
  constructor(
    @InjectRepository(CarAttribute)
    private readonly CarAttributeRepository: Repository<CarAttribute>,
  ) {}

  async seed() {
    const carAttributesPath = path.join(
      __dirname,
      '../../../../docs/mock_data/car_attributes.json',
    );

    const carAttributesJson: CarAttribute[] = JSON.parse(
      fs.readFileSync(carAttributesPath, 'utf-8'),
    );

    const carAttributes = carAttributesJson.map((carAttribute) => {
      return this.CarAttributeRepository.create({
        attribute_name: carAttribute.attribute_name,
        attribute_title: carAttribute.attribute_title,
      });
    });

    await this.CarAttributeRepository.save(carAttributes);
  }
}
