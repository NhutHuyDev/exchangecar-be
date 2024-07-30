import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersServices } from './customers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerWishlist } from './entities/customer_wishlist.entity';
import { CarPost } from '../carPosts/entities/car_post.entity';
import { S3Module } from '../s3/s3.module';
import { AuthCredential } from '../auth/entities/auth_credential.entity';
import { Staff } from '../staffs/entities/staff.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      CustomerWishlist,
      CarPost,
      AuthCredential,
      Staff,
    ]),
    S3Module,
  ],
  controllers: [CustomersController],
  providers: [CustomersServices],
})
export class CustomersModule {}
