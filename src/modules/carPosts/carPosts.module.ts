import { Module } from '@nestjs/common';
import { CarPostsController } from './carPosts.controller';
import { CarPostsServices } from './carPosts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarPost } from './entities/car_post.entity';
import { Car } from '../cars/entities/car.entity';
import { CarPostQueriesService } from './carPostQueries.service';
import { CarBrand } from '../cars/entities/car_brand.entity';
import { CarModel } from '../cars/entities/car_model.entity';
import { City } from '../customer/entities/city.entity';
import { CarAttributeOption } from '../cars/entities/car_attribute_option.entity';
import { S3Module } from '../s3/s3.module';
import { CarGallery } from '../cars/entities/car_galleries.entity';
import { Customer } from '../customer/entities/customer.entity';
import { PaymentModule } from '../payment/payment.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CarPost,
      Car,
      CarBrand,
      CarModel,
      CarGallery,
      City,
      CarAttributeOption,
      Customer,
    ]),
    S3Module,
    PaymentModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [CarPostsController],
  providers: [CarPostsServices, CarPostQueriesService],
  exports: [CarPostsServices],
})
export class CarPostsModule {}
