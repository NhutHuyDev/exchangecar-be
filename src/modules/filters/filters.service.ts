import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarBrand } from '../cars/entities/car_brand.entity';
import { Repository } from 'typeorm';
import { CarModel } from '../cars/entities/car_model.entity';
import { City } from '../customer/entities/city.entity';

@Injectable()
export class FiltersService {
  constructor(
    @InjectRepository(CarBrand)
    private carBrandRepository: Repository<CarBrand>,
    @InjectRepository(CarModel)
    private carModelRepository: Repository<CarModel>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
  ) {}

  async getFilters() {
    // Filter by car's brands & models
    const carBrands = await this.carBrandRepository.find();
    const carBrandFilter = {
      title: 'Hãng xe',
      name: 'carBrand',
      options: await Promise.all(
        carBrands.map(async (carBrand) => {
          const carModels = await this.carModelRepository.findBy({
            car_brand: carBrand,
          });

          return {
            title: carBrand.brand_name,
            value: carBrand.brand_param,
            modelFilter: {
              name: 'carModel',
              options: carModels.map((carModel) => ({
                title: carModel.model_name,
                value: carModel.model_param,
              })),
            },
          };
        }),
      ),
    };

    // Filter by city
    const cities = await this.cityRepository.find();
    const citiesFilter = {
      title: 'Thành phố',
      name: 'city',
      options: cities.map((city) => ({
        title: city.city_name,
        value: city.city_param,
      })),
    };

    // Filter by manufacturingDate
    const startYear = 1990;
    const currentYear = new Date().getFullYear();
    const manufacturingDateFilter = {
      title: 'Thành phố',
      name: 'manufacturingDate',
      options: Array.from(
        { length: currentYear - startYear + 1 },
        (_, i) => startYear + i,
      ),
    };

    // Filter by manufacturingDate
    const sellingPriceFilter = {
      title: 'Giá',
      name: 'sellingPrice',
    };

    const filters = {
      carBrand: carBrandFilter,
      city: citiesFilter,
      manufacturingDate: manufacturingDateFilter,
      sellingPrice: sellingPriceFilter,
    };

    return {
      filters,
    };
  }
}
