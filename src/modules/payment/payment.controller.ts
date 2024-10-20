import { Body, Controller, forwardRef, Inject, Post } from '@nestjs/common';
import { MomoPaymenNofity } from './dto/momo-payment-notify.dto';
import { CarPostsServices } from '../carPosts/carPosts.service';
import { PaymentServices } from './payment.service';
import SystemPackageOptions from '@/constraints/systemPackage.enum.constraint';

@Controller('payment')
export class PaymentController {
  constructor(
    @Inject(forwardRef(() => CarPostsServices))
    private carPostsService: CarPostsServices,
    private paymentService: PaymentServices,
  ) {}

  @Post('/momo-hook')
  async getMomoPaymentNotification(@Body() momoPaymenNofity: MomoPaymenNofity) {
    console.log('momo-hook:', momoPaymenNofity);

    if (momoPaymenNofity.resultCode === 0) {
      const { amount, requestId } = momoPaymenNofity;

      const extra_data = JSON.parse(momoPaymenNofity.extraData) as {
        post_id: number;
        days_publish: number;
        package_option: SystemPackageOptions;
      };

      const { post_id, days_publish, package_option } = extra_data;

      if (!momoPaymenNofity.resultCode) {
        await this.carPostsService.publishCarPost(
          post_id,
          package_option,
          days_publish,
        );

        await this.paymentService.createMomoTransaction(
          post_id,
          amount,
          days_publish,
          requestId,
        );
      }
    }

    return {
      payment_status: momoPaymenNofity,
    };
  }
}
