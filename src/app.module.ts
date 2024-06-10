import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { CarsModule } from './modules/cars/cars.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StaffsModule } from './modules/staffs/staffs.module';
import postgres from './configs/postgres.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV.trim() === 'development'
          ? '.env.development.local'
          : '.env',
      load: [postgres],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('postgres'),
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    CarsModule,
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
