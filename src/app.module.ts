import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CustomersModule } from './modules/customer/customers.module';
import { CarPostsModule } from './modules/carPosts/carPosts.module';
import { CarsModule } from './modules/cars/cars.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StaffsModule } from './modules/staffs/staffs.module';
import postgres from './configs/postgres.config';
import s3 from './configs/s3.config';
import momoPayment from '@/configs/momo.payment.config';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV.trim() === 'development'
          ? '.env.development.local'
          : '.env',
      load: [postgres, s3, momoPayment],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('postgres'),
    }),
    AuthModule,
    CustomersModule,
    CarPostsModule,
    CarsModule,
    StaffsModule,
    PaymentModule,
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
