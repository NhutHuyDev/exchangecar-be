import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({
  path:
    process.env.NODE_ENV.trim() === 'development'
      ? '.env.development.local'
      : '.env',
});

export type MoMoPaymentConfig = {
  momoPartnerCode: string;
  momoAccessKey: string;
  momoSecretKey: string;
};

const config: MoMoPaymentConfig = {
  momoPartnerCode: process.env.MOMO_PARTNER_CODE,
  momoAccessKey: process.env.MOMO_PAYMENT_ACCESS_KEY,
  momoSecretKey: process.env.MOMO_PAYMENT_SECRET_KEY,
};

export default registerAs('momoPayment', () => config);
