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
      data: {
        newCarPost: await this.carPostsService.createCarPost(
          authId,
          createCarPostDTO,
          car_galleries,
        ),
      },
    };
  }

  @Patch('/:post_id')
  @Roles(SystemRole.Individual_Customer)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updatePost(@Req() request: RequestWithUser) {
    return {
      post: 'updated',
    };
  }

  @Delete('/:post_id')
  @Roles(SystemRole.Individual_Customer)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deletePost(@Req() request: RequestWithUser) {
    return {
      post: 'deleted',
    };
  }
}
