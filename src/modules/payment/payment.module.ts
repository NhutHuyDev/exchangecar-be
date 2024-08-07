import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostTransaction } from './entities/transaction.entity';
import { PaymentServices } from './payment.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostTransaction])],
  providers: [PaymentServices],
  exports: [PaymentServices],
})
export class PaymentModule {}
