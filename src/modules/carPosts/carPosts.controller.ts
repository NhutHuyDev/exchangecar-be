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
import { CreatePublishPostDto } from './dto/create-published-post.dto';
import SystemPackageOptions from '@/constraints/systemPackage.enum.constraint';
import { GenerateDescriptionDto } from './dto/generate-description.dto';

@Controller('posts')
export class CarPostsController {
  constructor(
    private carPostsService: CarPostsServices,
    private carPostQueriesService: CarPostQueriesService,
  ) {}

  @Get('/query-table')
  async getFilter() {
    return await this.carPostQueriesService.getFilters()
  }

  @Get('/all')
  async getAllPosts() {
    return await this.carPostsService.getAllPosts()
  }

  @Get()
  async getPosts(@Query() query: CarPostQueryDto) {
    return await this.carPostsService.getPosts(query)
  }

  @Get('/powered')
  async getPoweredPosts(@Query() query: CarPostQueryDto) {
    return await this.carPostsService.getPoweredPosts(query)
  }

  @Get('/powered/latest')
  async getLatestPoweredPosts() {
    return await this.carPostsService.getLatestPoweredPosts()
  }

  @Get('/premium-and-higher')
  async getPremiumAndHigherPosts(@Query() query: CarPostQueryDto) {
    return {
      data: await this.carPostsService.getPremiumAndHigherPosts(query),
    };
  }

  @Get('/latest')
  async getLatestPosts() {
    return await this.carPostsService.getLatestPosts()
  }

  @Get('/relevant')
  async getRelevantPosts(@Query() query: CarPostQueryDto) {
    return await this.carPostsService.getRelevantPosts(query.car_brand)
  }

  @Get('/own')
  @Roles(SystemRole.Individual_Customer)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  async getAllPostsByCustomer(
    @Req() request: RequestWithUser,
    @Query() query: CarPostQueryDto
  ) {
    return {
      data: await this.carPostsService.getYourPosts(request.user.authId, query),
    };
  }

  @Get('/customer/:customer_id')
  async getPostsByCustomer(
    @Param() param: GetPostsByCustomerDto,
    @Query() query: CarPostQueryDto,
  ) {
    return await this.carPostsService.getPostByCustomer(
        param.customer_id,
        query,
      )
  }

  @Get('/:slug')
  async getPostByCarSlug(@Param() param: GetPostByCarSlugDto) {
    return await this.carPostsService.getPostByCarSlug(param.slug)
  }

  @Post('/generate-description')
  @Roles(SystemRole.Individual_Customer)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  async generateCarPost(
    @Body() generateDescriptionDto: GenerateDescriptionDto,
  ) {
    return await this.carPostsService.generateCarPost(generateDescriptionDto)
  }
  
  @Post('/draft')
  @UseInterceptors(FilesInterceptor('car_galleries'))
  @Roles(SystemRole.Individual_Customer)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  async createDraftPost(
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

    return await this.carPostsService.createDraftCarPost(
        authId,
        createCarPostDTO,
        car_galleries,
      )
  }

  @Post('/publish/:post_id')
  @Roles(SystemRole.Individual_Customer)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  async publishPost(
    @Req() request: RequestWithUser,
    @Param() publishPostParamDto: { post_id: number },
    @Body()
    publishPostBodyDto: {
      days_publish: number;
      package_option: SystemPackageOptions;
    },
  ) {
    return await this.carPostsService.publishCarPostFromDraft(
        publishPostParamDto.post_id,
        publishPostBodyDto.days_publish,
        publishPostBodyDto.package_option,
      )
  }

  @Post('/publish')
  @UseInterceptors(FilesInterceptor('car_galleries'))
  @Roles(SystemRole.Individual_Customer)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  async createPublishPost(
    @Req() request: RequestWithUser,
    @Body() createPublishPostDto: CreatePublishPostDto,
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

    return await this.carPostsService.createPublishCarPost(
        authId,
        createPublishPostDto,
        car_galleries,
      )
  }

  @Post('/unactive/:post_id')
  @Roles(SystemRole.Individual_Customer)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  async unactivePost(
    @Req() request: RequestWithUser,
    @Param() unActivePostParamDto: { post_id: number },
  ) {
    return await this.carPostsService.unActivePost(
        request.user,
        unActivePostParamDto.post_id,
      )
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
    return await this.carPostsService.updateCarPost(
        request.user,
        param.post_id,
        updateCarPostDto,
        car_galleries,
      )
  }

  @Delete('/:post_id')
  @Roles(SystemRole.Individual_Customer)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  async deletePost(
    @Req() request: RequestWithUser,
    @Param() param: { post_id: number },
  ) {
    return await this.carPostsService.deleteCarPost(
        request.user,
        param.post_id,
      )
  }
}
