import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeederInterface } from '../seeder.interface';
import * as path from 'node:path';
import * as fs from 'fs';
import { City } from '@/modules/customer/entities/city.entity';

@Injectable()
export class CitiesSeeder implements SeederInterface {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async seed() {
    const citiesPath = path.join(__dirname, '../../../../docs/mock_data/cities.json');

    const citiesJson: {
      city_code: number;
      city_name: string;
      city_param: string;
    }[] = JSON.parse(fs.readFileSync(citiesPath, 'utf-8'));

    const cities = citiesJson.map((city) => {
      return this.cityRepository.create({
        city_code: city.city_code,
        city_name: city.city_name,
        city_param: city.city_param,
      });
    });

    await this.cityRepository.save(cities);
  }
}
