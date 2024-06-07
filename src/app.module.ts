import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CarsModule } from './cars/cars.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthCredential } from './auth/entities/auth_credential.entity';
import { Session } from './auth/entities/session.entity';
import { VerifyOTP } from './auth/entities/verify_otp.entity';
import { KeyStore } from './auth/entities/key_store.entity';
import { Customer } from './users/entities/customer.entity';
import { Address } from './users/entities/address.entity';
import { Staff } from './users/entities/staff.entity';
import { CarBrand } from './cars/entities/car_brand.entity';
import { CarModel } from './cars/entities/car_model.entity';
import { CarVariantSpec } from './cars/entities/Car_Variant_Specs.entity';
import { Car } from './cars/entities/car.entity';
import { CarGallery } from './cars/entities/car_galleries.entity';
import { CarPost } from './posts/entities/car_post.entity';
import { CarPostCommitments } from './posts/entities/post_commitment.entity';
import { CustomerWishlist } from './users/entities/customer_wishlist.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'pinandbin',
      database: 'exchange-car-db',
      entities: [
        VerifyOTP,
        AuthCredential,
        KeyStore,
        Session,
        Address,
        Customer,
        Staff,
        CarBrand,
        CarModel,
        CarVariantSpec,
        Car,
        CarGallery,
        CarPost,
        CarPostCommitments,
        CustomerWishlist,
      ],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    CarsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {
    console.log(`connect to ${dataSource.driver.database} successfully`);
  }
}
