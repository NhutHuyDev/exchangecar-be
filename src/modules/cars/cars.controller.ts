import { Body, Controller, Post } from '@nestjs/common';
import { CarsService } from './cars.service';
import { GetCarModelDTO } from './dto/get-car-models.dto';
import { GetCarVariantDTO } from './dto/get-car-variants.dto';
import { GetCarSpecsDTO } from './dto/get-car-specs.dto';

@Controller('cars')
export class CarsController {
  constructor(private carsService: CarsService) {}

  @Post('brands')
  async getCarBrands() {
    return await this.carsService.getCarBrands()
  }

  @Post('models')
  async getCarModels(@Body() getCarModelDTO: GetCarModelDTO) {
    return await this.carsService.getCarModels(getCarModelDTO.brand_name)
  }

  @Post('variants')
  async getCarVariants(@Body() getCarVariants: GetCarVariantDTO) {
    return await this.carsService.getCarVariants(
        getCarVariants.model_name,
        getCarVariants.manufacturing_date,
      )
  }

  @Post('specs')
  async getCarSpecs(@Body() getCarSpecsDTO: GetCarSpecsDTO) {
    return await this.carsService.getCarSpecs(
        getCarSpecsDTO.variant_name,
        getCarSpecsDTO.manufacturing_date,
      )
  }

  @Post('cities')
  async getCity() {
    return await this.carsService.getCities()
  }

  @Post('districts')
  async getDistricts(@Body() getDistrictDTO: { city_name: string }) {
    return await this.carsService.getDistricts(getDistrictDTO.city_name)
  }
}
