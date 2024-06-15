import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeederInterface } from '../seeder.interface';
import * as path from 'node:path';
import * as fs from 'fs';
import { District } from '@/modules/customer/entities/district.entity';
import { City } from '@/modules/customer/entities/city.entity';

@Injectable()
export class DistrictsSeeder implements SeederInterface {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
  ) {}

  async seed() {
    const brandModelsPath = path.join(
      __dirname,
      '../../../../data/districts.json',
    );

    const cities = await this.cityRepository.find();

    const districtsJson: {
      district_code: number;
      city: number;
      district_name: string;
      district_param: string;
    }[] = JSON.parse(fs.readFileSync(brandModelsPath, 'utf-8'));

    const districts = districtsJson.map((district) => {
      return this.districtRepository.create({
        district_code: district.district_code,
        district_name: district.district_name,
        district_param: district.district_param,
        city: this.returnCityOfDistrict(cities, district.city),
      });
    });

    await this.districtRepository.save(districts);
  }

  returnCityOfDistrict(cities: City[], districtToReturn: number) {
    for (const city of cities) {
      if (city.city_code === districtToReturn) {
        return city;
      }
    }

    throw new BadRequestException('city is not supported');
  }
}
