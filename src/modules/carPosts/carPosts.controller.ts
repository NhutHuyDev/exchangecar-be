import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { RequestWithUser } from '@/types/requests.type';
import { Roles } from '../auth/decorators/roles.decorator';
import SystemRole from '@/constraints/systemRoles.enum.constraint';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CarPostsServices } from './carPosts.service';
import { CarPostQueryDto } from './dto/carPostQuery.dto';
import { CarPostQueriesService } from './carPostQueries.service';

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

  @Post()
  @Roles(SystemRole.Individual_Customer)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createPost(@Req() request: RequestWithUser) {
    return {
      post: 'created',
    };
  }

  @Patch()
  @Roles(SystemRole.Individual_Customer)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updatePost(@Req() request: RequestWithUser) {
    return {
      post: 'updated',
    };
  }

  @Delete()
  @Roles(SystemRole.Individual_Customer)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deletePost(@Req() request: RequestWithUser) {
    return {
      post: 'updated',
    };
  }
}
