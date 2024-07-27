import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersServices } from './customers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerWishlist } from './entities/customer_wishlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, CustomerWishlist])],
  controllers: [CustomersController],
  providers: [CustomersServices],
})
export class CustomersModule {}
