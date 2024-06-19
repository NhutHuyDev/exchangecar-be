import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({
  path:
    process.env.NODE_ENV.trim() === 'development'
      ? '.env.development.local'
      : '.env',
});

export type S3Config = {
  name: string;
  region: string;
  accessKey: string;
  secretKet: string;
};

const config: S3Config = {
  name: process.env.AWS_BUCKET_NAME,
  region: process.env.AWS_BUCKET_REGION,
  accessKey: process.env.AWS_BUCKER_ACCESS_KEY,
  secretKet: process.env.AWS_BUCKER_SECRET_KEY,
};

export default registerAs('s3', () => config);
