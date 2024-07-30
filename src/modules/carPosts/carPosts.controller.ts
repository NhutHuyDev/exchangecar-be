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
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { RequestWithUser } from '@/types/requests.type';
import { Roles } from '../auth/decorators/roles.decorator';
import SystemRole from '@/constraints/systemRoles.enum.constraint';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CarPostsServices } from './carPosts.service';
import { CarPostQueryDto } from './dto/query-car-post.dto';
import { CarPostQueriesService } from './carPostQueries.service';
import { CreateCarPostDto } from './dto/create-car-post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GetPostByCarSlugDto } from './dto/get-post-by-car-slug.dto';
import { GetPostsByCustomerDto } from './dto/get-posts-by-customer.dto';
import { UpdateCarPostDto } from './dto/update-car-post.dto';

@Controller('posts')
export class CarPostsController {
  constructor(
    private carPostsService: CarPostsServices,
    private carPostQueriesService: CarPostQueriesService,
  ) {}

  @Get('/query-table')
  async getFilter() {
    return {
      data: await this.carPostQueriesService.getFilters(),
    };
  }

  @Get('/all')
  async getAllPosts() {
    return {
      data: await this.carPostsService.getAllPosts(),
    };
  }

  @Get()
  async getPosts(@Query() query: CarPostQueryDto) {
    return {
      data: await this.carPostsService.getPosts(query),
    };
  }

  @Get('/latest')
  async getLatestPosts() {
    return {
      data: await this.carPostsService.getLatestPosts(),
    };
  }

  @Get('/relevant')
  async getRelevantPosts(@Query() query: any) {
    return {
      data: await this.carPostsService.getRelevantPosts(query.car_brand),
    };
  }

  @Get('/customer/:customer_id/all')
  async getAllPostsByCustomer(@Param() param: GetPostsByCustomerDto) {
    return {
      data: await this.carPostsService.getAllPostByCustomer(param.customer_id),
    };
  }

  @Get('/customer/:customer_id')
  async getPostsByCustomer(
    @Param() param: GetPostsByCustomerDto,
    @Query() query: CarPostQueryDto,
  ) {
    return {
      data: await this.carPostsService.getPostByCustomer(
        param.customer_id,
        query,
      ),
    };
  }

  @Get('/:slug')
  async getPostByCarSlug(@Param() param: GetPostByCarSlugDto) {
    return {
      data: await this.carPostsService.getPostByCarSlug(param.slug),
    };
  }

  @Post()
  @UseInterceptors(FilesInterceptor('car_galleries'))
  @Roles(SystemRole.Individual_Customer)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  async createPost(
    @Req() request: RequestWithUser,
    @Body() createCarPostDTO: CreateCarPostDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
      }),
    )
    car_galleries: Array<Express.Multer.File>,
  ) {
    const authId = request.user.authId;

    return {
      data: await this.carPostsService.createCarPost(
        authId,
        createCarPostDTO,
        car_galleries,
      ),
    };
  }

  @Patch('/:post_id')
  @UseInterceptors(FilesInterceptor('car_galleries'))
  @Roles(SystemRole.Individual_Customer)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  async updatePost(
    @Req() request: RequestWithUser,
    @Param() param: { post_id: number },
    @Body() updateCarPostDto: UpdateCarPostDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
        fileIsRequired: false,
      }),
    )
    car_galleries: Array<Express.Multer.File>,
  ) {
    return {
      data: await this.carPostsService.updateCarPost(
        request.user,
        param.post_id,
        updateCarPostDto,
        car_galleries,
      ),
    };
  }

  @Delete('/:post_id')
  @Roles(SystemRole.Individual_Customer)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  async deletePost(
    @Req() request: RequestWithUser,
    @Param() param: { post_id: number },
  ) {
    return {
      data: await this.carPostsService.deleteCarPost(
        request.user,
        param.post_id,
      ),
    };
  }
}
