import { Body, Controller, Get } from '@nestjs/common';
import { CarsService } from './cars.service';
import { GetCarModelDTO } from './dto/get-car-models.dto';
import { GetCarVariantDTO } from './dto/get-car-variants.dto';
import { GetCarSpecsDTO } from './dto/get-car-specs.dto';

@Controller('cars')
export class CarsController {
  constructor(private carsService: CarsService) {}

  @Get('brands')
  async getCarBrands() {
    return {
      data: await this.carsService.getCarBrands(),
    };
  }

  @Get('models')
  async getCarModels(@Body() getCarModelDTO: GetCarModelDTO) {
    return {
      data: await this.carsService.getCarModels(getCarModelDTO.brand_name),
    };
  }

  @Get('variants')
  async getCarVariants(@Body() getCarVariants: GetCarVariantDTO) {
    return {
      data: await this.carsService.getCarVariants(
        getCarVariants.model_name,
        getCarVariants.manufacturing_date,
      ),
    };
  }

  @Get('specs')
  async getCarSpecs(@Body() getCarSpecsDTO: GetCarSpecsDTO) {
    return {
      data: await this.carsService.getCarSpecs(
        getCarSpecsDTO.variant_name,
        getCarSpecsDTO.manufacturing_date,
      ),
    };
  }
}
