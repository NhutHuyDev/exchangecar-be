import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeederInterface } from '../seeder.interface';
import * as path from 'node:path';
import * as fs from 'fs';
import { CarAttribute } from '@/modules/cars/entities/car_attribute.entity';
import { CarAttributeOption } from '@/modules/cars/entities/car_attribute_option.entity';

@Injectable()
export class CarAttributeOptionsSeeder implements SeederInterface {
  constructor(
    @InjectRepository(CarAttribute)
    private readonly carAttributeRepository: Repository<CarAttribute>,
    @InjectRepository(CarAttributeOption)
    private readonly carAttributeOptionRepository: Repository<CarAttributeOption>,
  ) {}

  async seed() {
    const brandModelsPath = path.join(
      __dirname,
      '../../../../data/car_attribute_options.json',
    );

    const carAttributes = await this.carAttributeRepository.find();

    const brandModelsJson: {
      attribute_name: string;
      option_value: string;
      option_param: string;
    }[] = JSON.parse(fs.readFileSync(brandModelsPath, 'utf-8'));

    const carAttributeOptions = brandModelsJson.map((carAttributeOption) => {
      return this.carAttributeOptionRepository.create({
        option_param: carAttributeOption.option_param,
        option_value: carAttributeOption.option_value,
        attribute: this.returnCarAttributeOfOption(
          carAttributes,
          carAttributeOption.attribute_name,
        ),
      });
    });

    await this.carAttributeOptionRepository.save(carAttributeOptions);
  }

  returnCarAttributeOfOption(
    carAttributes: CarAttribute[],
    attributeToReturn: string,
  ) {
    for (const carAttribute of carAttributes) {
      if (carAttribute.attribute_name === attributeToReturn) {
        return carAttribute;
      }
    }

    throw new BadRequestException("car's attribute is not supported");
  }
}
