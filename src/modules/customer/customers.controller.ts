import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CustomersServices } from './customers.service';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { RequestWithUser } from '@/types/requests.type';
import { CustomerUpdateInformationDto } from './dto/update-information.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Patch('/me')
  @UseInterceptors(FileInterceptor('avatar'))
  @UseGuards(JwtAccessTokenGuard)
  async updateInformation(
    @Req() request: RequestWithUser,
    @Body() customerUpdateInformationDto: CustomerUpdateInformationDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
        fileIsRequired: false,
      }),
    )
    avatar?: Express.Multer.File,
  ) {
    return {
      data: await this.customersServices.uploadInformation(
        request.user,
        customerUpdateInformationDto,
        avatar,
      ),
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

  @UseGuards(JwtAccessTokenGuard)
  @Post('/wishlist/:post_id')
  async addToWishlist(
    @Req() request: RequestWithUser,
    @Param() params: { post_id: number },
  ) {
    return {
      data: await this.customersServices.addToWishlist(
        request.user,
        params.post_id,
      ),
    };
  }

  @UseGuards(JwtAccessTokenGuard)
  @Delete('/wishlist/:post_id')
  async removeFromWishlist(
    @Req() request: RequestWithUser,
    @Param() params: { post_id: number },
  ) {
    return {
      data: await this.customersServices.removeFromWishlist(
        request.user,
        params.post_id,
      ),
    };
  }

  @Get('/others/:customer_id')
  async getOtherCustomer(
    @Param() getOtherCustomerParams: { customer_id: number },
  ) {
    return {
      data: await this.customersServices.getOtherCustomer(
        getOtherCustomerParams.customer_id,
      ),
    };
  }
}
