import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from '../auth/interfaces/jwtPayload.interface';
import { CustomerWishlist } from './entities/customer_wishlist.entity';

@Injectable()
export class CustomersServices {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(CustomerWishlist)
    private customerWishlistRepository: Repository<CustomerWishlist>,
  ) {}

  async getMe(user: JwtPayload) {
    const { authId } = user;
    const currentUser = await this.customerRepository.findOne({
      where: {
        auth_credential: {
          id: authId,
        },
      },
      relations: {
        address: true,
      },
    });

    if (currentUser) {
      return { currentUser: currentUser };
    }

    throw new NotFoundException('user is not found');
  }

  async deleteMe(user: JwtPayload) {
    const { authId } = user;

    const deleteResult = await this.customerRepository.delete({
      auth_credential: {
        id: authId,
      },
    });

    return {
      deleteResult: deleteResult,
    };
  }

  async getWishlist(user: JwtPayload) {
    const { authId } = user;

    const wishlist = await this.customerWishlistRepository.findOne({
      where: {
        customer: {
          auth_credential: {
            id: authId,
          },
        },
      },
      relations: {
        car_posts: true,
      },
    });

    if (wishlist) {
      return { wishlist: wishlist };
    }

    throw new NotFoundException(`user's wishlist is not found`);
  }
}
