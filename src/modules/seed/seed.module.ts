import { TypeOrmModule } from '@nestjs/typeorm';
import postgres from '../../configs/postgres.config';
import { SeedService } from './seed.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Role } from '../auth/entities/role.entity';
import { RolesSeeder } from './seeders/roles.seeder';
import { AuthCredential } from '../auth/entities/auth_credential.entity';
import { Staff } from '../staffs/entities/staff.entity';
import { AdminSeeder } from './seeders/admin.seeder';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [postgres],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('postgres'),
    }),
    TypeOrmModule.forFeature([Role, AuthCredential, Staff]),
  ],
  controllers: [],
  providers: [SeedService, RolesSeeder, AdminSeeder],
})
export class SeedModule {}
