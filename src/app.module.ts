import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { CarsModule } from './modules/cars/cars.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthCredential } from './modules/auth/entities/auth_credential.entity';
import { Session } from './modules/auth/entities/session.entity';
import { VerifyOTP } from './modules/auth/entities/verify_otp.entity';
import { Customer } from './modules/users/entities/customer.entity';
import { Address } from './modules/users/entities/address.entity';
import { Staff } from './modules/users/entities/staff.entity';
import { CarBrand } from './modules/cars/entities/car_brand.entity';
import { CarModel } from './modules/cars/entities/car_model.entity';
import { CarVariantSpec } from './modules/cars/entities/Car_Variant_Specs.entity';
import { Car } from './modules/cars/entities/car.entity';
import { CarGallery } from './modules/cars/entities/car_galleries.entity';
import { CarPost } from './modules/posts/entities/car_post.entity';
import { CarPostCommitments } from './modules/posts/entities/post_commitment.entity';
import { CustomerWishlist } from './modules/users/entities/customer_wishlist.entity';
import { ConfigModule } from '@nestjs/config';
import { OtpModule } from './otp/otp.module';
import { StaffsModule } from './staffs/staffs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV.trim() === 'development' ? '.env.dev' : '.env',
      cache: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB_NAME,
      entities: [
        VerifyOTP,
        AuthCredential,
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
    OtpModule,
    StaffsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {
    console.log(`env=${process.env.NODE_ENV} `);
    console.log(
      `connect to Postgres - ${dataSource.driver.database} successfully`,
    );
  }
}
