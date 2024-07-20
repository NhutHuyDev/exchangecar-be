import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeederInterface } from '../seeder.interface';
import * as path from 'node:path';
import * as fs from 'fs';
import { CarModel } from '@/modules/cars/entities/car_model.entity';
import { CarVariantSpec } from '@/modules/cars/entities/car_variant_specs.entity';

@Injectable()
export class CarVariantSpecsSeeder implements SeederInterface {
  constructor(
    @InjectRepository(CarModel)
    private readonly carModelRepository: Repository<CarModel>,
    @InjectRepository(CarVariantSpec)
    private readonly CarVariantSpecRepository: Repository<CarVariantSpec>,
  ) {}

  async seed() {
    const carVariantSpecsPath = path.join(
      __dirname,
      '../../../../data/car_variant_specs.json',
    );

    const carModels = await this.carModelRepository.find();

    const carVariantSpecsJson: {
      variant_name: string;
      variant_fullname: string;
      car_model: string;
      manufacturing_date: number;
      body_type: string;
      total_doors: number;
      total_seating: number;
      wheelbase: number;
      engine_size: number;
      horsepower_hp: number;
      touque: number;
      drivetrain: string;
      transmission: string;
      engine_type: string;
      fuel_type: string;
    }[] = JSON.parse(fs.readFileSync(carVariantSpecsPath, 'utf-8'));

    const carVariantSpecs = carVariantSpecsJson.map((carVariantSpec) => {
      return this.CarVariantSpecRepository.create({
        variant_name: carVariantSpec.variant_name,
        variant_fullname: carVariantSpec.variant_fullname,
        manufacturing_date: carVariantSpec.manufacturing_date,
        body_type: carVariantSpec.body_type,
        total_seating: carVariantSpec.total_seating,
        total_doors: carVariantSpec.total_doors,
        wheelbase: carVariantSpec.wheelbase,
        engine_size: carVariantSpec.engine_size,
        horsepower_hp: carVariantSpec.horsepower_hp,
        touque: carVariantSpec.touque,
        drivetrain: carVariantSpec.drivetrain,
        transmission: carVariantSpec.transmission,
        engine_type: carVariantSpec.engine_type,
        fuel_type: carVariantSpec.fuel_type,
        car_model: this.returnCarModelOfVariant(
          carModels,
          carVariantSpec.car_model,
        ),
      });
    });

    await this.CarVariantSpecRepository.save(carVariantSpecs);
  }

  returnCarModelOfVariant(carModels: CarModel[], modelToReturn: string) {
    for (const carModel of carModels) {
      if (carModel.model_name === modelToReturn) {
        return carModel;
      }
    }

    throw new BadRequestException("car's models is not supported");
  }
}
