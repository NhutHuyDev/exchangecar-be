import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({
  path:
    process.env.NODE_ENV.trim() === 'dev'
      ? '.env'
      : '.env.production.local',
});

export type MoMoPaymentConfig = {
  momoPartnerCode: string;
  momoAccessKey: string;
  momoSecretKey: string;
  ipnUrl: string;
  redirectUrl: string;
};

const config: MoMoPaymentConfig = {
  momoPartnerCode: process.env.MOMO_PARTNER_CODE,
  momoAccessKey: process.env.MOMO_PAYMENT_ACCESS_KEY,
  momoSecretKey: process.env.MOMO_PAYMENT_SECRET_KEY,
  ipnUrl: process.env.IPN_URL,
  redirectUrl: process.env.PAYMENT_REDIRECT_URL,
};

export default registerAs('momoPayment', () => config);
