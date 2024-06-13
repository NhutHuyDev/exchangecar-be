import { Controller, Get, HttpCode } from '@nestjs/common';
import { FiltersService } from './filters.service';

@Controller('filters')
export class FiltersController {
  constructor(private filtersService: FiltersService) {}

  @Get('/')
  @HttpCode(200)
  async getFilters() {
    return {
      data: await this.filtersService.getFilters(),
    };
  }
}
