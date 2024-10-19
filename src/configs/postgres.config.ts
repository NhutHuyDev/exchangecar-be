import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({
  path:
    process.env.NODE_ENV.trim() === 'dev'
      ? '.env'
      : '.env.production.local',
});

export const config: DataSourceOptions = {
  type: 'postgres',
  host: `${process.env.POSTGRES_HOST}`,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: `${process.env.POSTGRES_USERNAME}`,
  password: `${process.env.POSTGRES_PASSWORD}`,
  database: `${process.env.POSTGRES_DATABASE_NAME}`,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  synchronize: true,
};


console.log(config)

export default registerAs('postgres', () => config);
export const postgresDataSource = new DataSource(config);
