import { Injectable } from '@nestjs/common';
import { CarBrand } from './entities/car_brand.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CarModel } from './entities/car_model.entity';
import { CarVariantSpec } from './entities/car_variant_specs.entity';
import { City } from '../customer/entities/city.entity';
import { District } from '../customer/entities/district.entity';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(CarBrand)
    private carBrandRepository: Repository<CarBrand>,
    @InjectRepository(CarModel)
    private carModelRepository: Repository<CarModel>,
    @InjectRepository(CarVariantSpec)
    private carVariantSpecRepository: Repository<CarVariantSpec>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(District)
    private districtRepository: Repository<District>,
  ) {}

  async getCarBrands() {
    const carBrands = await this.carBrandRepository.find();

    return {
      car_brands: carBrands.map((carBrand) => carBrand.brand_name),
    };
  }

  async getCarModels(brand_name: string) {
    const carModels = await this.carModelRepository.find({
      where: {
        car_brand: {
          brand_name: ILike(`%${brand_name}%`),
        },
      },
    });

    return {
      car_models: carModels.map((carModel) => carModel.model_name),
    };
  }

  async getCarVariants(model_name: string, manufacturing_date: number) {
    const carVariants = await this.carVariantSpecRepository.find({
      where: {
        car_model: {
          model_name: ILike(`%${model_name}%`),
        },
        manufacturing_date: manufacturing_date,
      },
    });

    return {
      car_variants: carVariants.map((carVariant) => carVariant.variant_name),
    };
  }

  async getCarSpecs(variant_name: string, manufacturing_date: number) {
    const carSpecs = await this.carVariantSpecRepository.findOne({
      where: {
        variant_name: ILike(`%${variant_name}%`),
        manufacturing_date: manufacturing_date,
      },
    });

    return {
      car_specs: {
        body_type: carSpecs.body_type,
        transmission: carSpecs.transmission,
        drivetrain: carSpecs.drivetrain,
        engine_type: carSpecs.engine_type,
        total_seating: carSpecs.total_seating,
        total_doors: carSpecs.total_doors,
      },
    };
  }

  async getCities() {
    const cities = await this.cityRepository.find();

    return {
      cities: cities.map((city) => city.city_name),
    };
  }

  async getDistricts(cityName: string) {
    const districts = await this.districtRepository.findBy({
      city: {
        city_name: cityName,
      },
    });

    return {
      districts: districts.map((district) => district.district_name),
    };
  }
}
