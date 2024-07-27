import { Controller, Delete, Get, Req, UseGuards } from '@nestjs/common';
import { CustomersServices } from './customers.service';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { RequestWithUser } from '@/types/requests.type';

@Controller('customers')
export class CustomersController {
  constructor(private customersServices: CustomersServices) {}

  @UseGuards(JwtAccessTokenGuard)
  @Get('/me')
  async getMe(@Req() request: RequestWithUser) {
    return {
      data: await this.customersServices.getMe(request.user),
    };
  }

  @UseGuards(JwtAccessTokenGuard)
  @Delete('/me')
  async deleteMe(@Req() request: RequestWithUser) {
    return {
      data: await this.customersServices.deleteMe(request.user),
    };
  }

  @UseGuards(JwtAccessTokenGuard)
  @Get('/wishlist')
  async getWishlist(@Req() request: RequestWithUser) {
    return {
      data: await this.customersServices.getWishlist(request.user),
    };
  }
}
