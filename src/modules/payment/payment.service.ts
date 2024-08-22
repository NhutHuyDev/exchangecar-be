import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostTransaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { MoMoPaymentConfig } from '@/configs/momo.payment.config';
import { CreatePayment } from './dto/create-payment.dto';
import * as crypto from 'crypto';
import axios from 'axios';
import { MomoPaymenInfo } from './dto/momo-payment-info.dto';
import { DaysPublishOptionTable } from '@/constraints/pricing.table';

@Injectable()
export class PaymentServices {
  private momoAccessKey: string;
  private momoPartnerCode: string;
  private momoSecretKey: string;

  constructor(
    @InjectRepository(PostTransaction)
    private postTransactionRepository: Repository<PostTransaction>,
    private configService: ConfigService,
  ) {
    const momoPayment =
      this.configService.get<MoMoPaymentConfig>('momoPayment');

    this.momoAccessKey = momoPayment.momoAccessKey;
    this.momoPartnerCode = momoPayment.momoPartnerCode;
    this.momoSecretKey = momoPayment.momoSecretKey;
  }

  async createMomoURL(momoPaymentInfo: CreatePayment) {
    const { days_publish, order_info, post_id, car_slug, package_option } =
      momoPaymentInfo;

    const order_id = this.momoPartnerCode + post_id + new Date().getTime();
    const request_id = order_id;
    const amount = DaysPublishOptionTable[days_publish][package_option].price;

    const extraData = JSON.stringify({
      post_id: post_id,
      car_slug: car_slug,
      package_option: package_option,
      days_publish: days_publish,
    });

    const rawSignature =
      'accessKey=' +
      this.momoAccessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      extraData +
      '&ipnUrl=' +
      'https://518c-104-28-237-72.ngrok-free.app/api/v1/payment/momo-hook' +
      '&orderId=' +
      order_id +
      '&orderInfo=' +
      order_info +
      '&partnerCode=' +
      this.momoPartnerCode +
      '&redirectUrl=https://exchangecar-management.vercel.app/cars' +
      '&requestId=' +
      request_id +
      '&requestType=payWithMethod';

    const signature = crypto
      .createHmac('sha256', this.momoSecretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = JSON.stringify({
      partnerCode: this.momoPartnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId: request_id,
      amount: String(amount),
      orderId: order_id,
      orderInfo: order_info,
      redirectUrl: 'https://exchangecar-management.vercel.app/cars',
      ipnUrl:
        'https://518c-104-28-237-72.ngrok-free.app/api/v1/payment/momo-hook',
      lang: 'en',
      requestType: 'payWithMethod',
      autoCapture: true,
      extraData: extraData,
      orderGroupId: '',
      signature: signature,
    });

    const options = {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/create',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };

    try {
      const result = await axios(options);

      return result.data as MomoPaymenInfo;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async createMomoTransaction(
    post_id: number,
    amount: number,
    days_displayed: number,
    transaction_id: string,
  ) {
    await this.postTransactionRepository.save({
      car_post: {
        id: post_id,
      },
      amount,
      days_displayed,
      payment_method: 'Pay with MoMo',
      transaction_id: transaction_id,
    });
  }
}
