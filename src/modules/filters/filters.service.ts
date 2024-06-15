import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarBrand } from '../cars/entities/car_brand.entity';
import { Repository } from 'typeorm';
import { CarModel } from '../cars/entities/car_model.entity';
import { City } from '../customer/entities/city.entity';
import { CarAttributeOption } from '../cars/entities/car_attribute_option.entity';
import SortOptions from '@/constraints/sortOptions.constaint';

@Injectable()
export class FiltersService {
  constructor(
    @InjectRepository(CarBrand)
    private carBrandRepository: Repository<CarBrand>,
    @InjectRepository(CarModel)
    private carModelRepository: Repository<CarModel>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(CarAttributeOption)
    private carAttributeOptionRepository: Repository<CarAttributeOption>,
  ) {}

  async getFilters() {
    /**
     * @description Filter by car's brand & cars' model
     **/
    const carBrands = await this.carBrandRepository.find();
    const carBrandModelFilter = {
      title: 'Hãng xe',
    };

    const brand_options = {};
    for (const carBrand of carBrands) {
      const carModels = await this.carModelRepository.findBy({
        car_brand: carBrand,
      });

      const modelOptions = {};
      for (const carModel of carModels) {
        modelOptions[carModel.model_param] = carModel.model_name;
      }

      const brandValue = {
        title: carBrand.brand_name,
        car_model: { options: modelOptions },
      };

      brand_options[carBrand.brand_param] = brandValue;
    }

    carBrandModelFilter['options'] = brand_options;

    /**
     * @description Filter by city
     **/
    const cities = await this.cityRepository.find();
    const citiesFilter = {
      title: 'Thành phố',
    };

    const city_options = {};
    for (const city of cities) {
      city_options[city.city_param] = city.city_name;
    }

    citiesFilter['city_options'] = city_options;

    /**
     * @description Filter by manufacturing_date
     **/
    const startYear = 2000;
    const currentYear = new Date().getFullYear();
    const manufacturingDateFilter = {
      title: 'Thành phố',
      options: Array.from(
        { length: currentYear - startYear + 1 },
        (_, i) => startYear + i,
      ),
    };

    /**
     * @description Filter by selling_price
     **/
    const sellingPriceFilter = {
      title: 'Giá',
    };

    /**
     * @description Filter by car_origin
     **/
    const carOriginOptions =
      await this.findOptionsByAttributeName('car_origin');

    const carOriginFilter = {
      title: 'Xuất xứ',
    };

    const originOptions = {};
    for (const option of carOriginOptions) {
      originOptions[option.option_param] = option.option_value;
    }

    carOriginFilter['options'] = originOptions;

    /**
     * @description Filter by car_status
     **/
    const carStatusOptions =
      await this.findOptionsByAttributeName('car_status');

    const carStatusFilter = {
      title: 'Tình trạng',
    };

    const statusOptions = {};
    for (const option of carStatusOptions) {
      statusOptions[option.option_param] = option.option_value;
    }

    carStatusFilter['options'] = statusOptions;

    /**
     * @description Filter by car_mileage
     **/
    const carMileageFilter = {
      title: 'Quãng đường đã đi',
    };

    /**
     * @description Filter by engine_type
     **/
    const carEngineTypeOptions =
      await this.findOptionsByAttributeName('engine_type');

    const engineTypeFilter = {
      title: 'Nhiên liệu',
    };

    const engineTypeOptions = {};
    for (const option of carEngineTypeOptions) {
      engineTypeOptions[option.option_param] = option.option_value;
    }

    engineTypeFilter['options'] = engineTypeOptions;

    /**
     * @description Filter by body_type
     **/
    const carBodyTypeOptions =
      await this.findOptionsByAttributeName('body_type');

    const bodyTypeFilter = {
      title: 'Kiểu dáng',
    };

    const bodyTypeOptions = {};
    for (const option of carBodyTypeOptions) {
      bodyTypeOptions[option.option_param] = option.option_value;
    }

    bodyTypeFilter['options'] = bodyTypeOptions;

    /**
     * @description Filter by out_color
     **/
    const carOutColorOptions =
      await this.findOptionsByAttributeName('out_color');

    const outColorFilter = {
      title: 'Màu ngoại thất',
    };

    const outColorOptions = {};
    for (const option of carOutColorOptions) {
      outColorOptions[option.option_param] = option.option_value;
    }

    outColorFilter['options'] = outColorOptions;

    /**
     * @description Filter by total_seating
     **/
    const totalSeatingFilter = {
      title: 'Số ghế',
      options: [2, 4, 7, 8, 9, 12],
    };

    /**
     * @description Filter by total_doors
     **/
    const totalDoorsFilter = {
      title: 'Số cửa',
      options: [2, 3, 4, 5],
    };

    /**
     * @description Filter by search
     **/
    const search = {
      title: 'Tìm kiếm',
    };

    /**
     * @description order_by
     **/
    const orderBy = {
      title: 'Sắp xếp',
      options: Object.values(SortOptions),
    };

    const filters = {
      car_brand: carBrandModelFilter,
      city: citiesFilter,
      manufacturing_date: manufacturingDateFilter,
      selling_price: sellingPriceFilter,
      car_origin: carOriginFilter,
      car_status: carStatusFilter,
      car_mileage: carMileageFilter,
      engine_type: engineTypeFilter,
      body_type: bodyTypeFilter,
      out_color: outColorFilter,
      total_seating: totalSeatingFilter,
      total_doors: totalDoorsFilter,
      search: search,
      order_by: orderBy,
    };

    return {
      filters,
    };
  }

  private async findOptionsByAttributeName(attributeName: string) {
    return this.carAttributeOptionRepository
      .createQueryBuilder('option')
      .innerJoinAndSelect('option.attribute', 'attribute')
      .where('attribute.attribute_name = :attributeName', { attributeName })
      .getMany();
  }
}
