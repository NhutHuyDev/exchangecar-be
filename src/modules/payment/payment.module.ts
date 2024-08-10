import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostTransaction } from './entities/transaction.entity';
import { PaymentServices } from './payment.service';
import { PaymentController } from './payment.controller';
import { CarPostsModule } from '../carPosts/carPosts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostTransaction]),
    forwardRef(() => CarPostsModule),
  ],
  providers: [PaymentServices],
  controllers: [PaymentController],
  exports: [PaymentServices],
})
export class PaymentModule {}
