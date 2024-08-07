import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostTransaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { MoMoPaymentConfig } from '@/configs/momo.payment.config';
import { CreatePayment } from './dto/create-payment';
import * as crypto from 'crypto';
import axios from 'axios';

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
    const { amount, order_info, order_id } = momoPaymentInfo;

    const request_id = this.momoPartnerCode + order_id + new Date().getTime();

    const rawSignature =
      'accessKey=' +
      this.momoAccessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      '' +
      '&ipnUrl=' +
      'https://74f8-104-28-237-72.ngrok-free.app/callback' +
      '&orderId=' +
      order_id +
      '&orderInfo=' +
      order_info +
      '&partnerCode=' +
      this.momoPartnerCode +
      '&redirectUrl=http://localhost:5000/views/home.html' +
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
      redirectUrl: 'http://localhost:5000/views/home.html',
      ipnUrl: 'https://74f8-104-28-237-72.ngrok-free.app/callback',
      lang: 'en',
      requestType: 'payWithMethod',
      autoCapture: true,
      extraData: '',
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
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  }
}
