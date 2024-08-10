import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from '../auth/interfaces/jwtPayload.interface';
import { CustomerWishlist } from './entities/customer_wishlist.entity';
import { CarPost } from '../carPosts/entities/car_post.entity';
import { plainToInstance } from 'class-transformer';
import { CustomerUpdateInformationDto } from './dto/update-information.dto';
import { S3Service } from '../s3/s3.service';
import { AuthCredential } from '../auth/entities/auth_credential.entity';
import SystemRole from '@/constraints/systemRoles.enum.constraint';
import { Staff } from '../staffs/entities/staff.entity';

@Injectable()
export class CustomersServices {
  constructor(
    @InjectRepository(AuthCredential)
    private authCredentialRepository: Repository<AuthCredential>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    @InjectRepository(CustomerWishlist)
    private customerWishlistRepository: Repository<CustomerWishlist>,
    @InjectRepository(CarPost)
    private carPostRepository: Repository<CarPost>,
    private s3Service: S3Service,
  ) {}

  async getMe(user: JwtPayload) {
    const { authId, roles } = user;

    console.log(roles);

    if (roles.includes(SystemRole.Individual_Customer)) {
      const currentUser: Customer & { user_roles?: SystemRole[] } =
        await this.customerRepository.findOne({
          where: {
            auth_credential: {
              id: authId,
            },
          },

          relations: {
            auth_credential: {
              roles: true,
            },
          },
        });

      if (currentUser) {
        const userRoles: SystemRole[] = currentUser.auth_credential.roles.map(
          (role) => role.role_title,
        );

        currentUser.user_roles = userRoles;

        return {
          currentUser: plainToInstance(Customer, currentUser),
        };
      }
    }

    if (roles.includes(SystemRole.Staff) || roles.includes(SystemRole.Admin)) {
      const currentUser: Staff & { user_roles?: SystemRole[] } =
        await this.staffRepository.findOne({
          where: {
            auth_credential: {
              id: authId,
            },
          },

          relations: {
            auth_credential: {
              roles: true,
            },
          },
        });

      if (currentUser) {
        const userRoles: SystemRole[] = currentUser.auth_credential.roles.map(
          (role) => role.role_title,
        );

        currentUser.user_roles = userRoles;

        return {
          currentUser: plainToInstance(Staff, currentUser),
        };
      }
    }

    throw new NotFoundException('user is not found');
  }

  async uploadInformation(
    user: JwtPayload,
    customerUpdateInformationDto: CustomerUpdateInformationDto,
    avatar?: Express.Multer.File,
  ) {
    const { authId } = user;
    const currentUser: Customer & { user_roles?: SystemRole[] } =
      await this.customerRepository.findOne({
        where: {
          auth_credential: {
            id: authId,
          },
        },

        relations: {
          auth_credential: {
            roles: true,
          },
        },
      });

    // first_name
    currentUser.first_name = customerUpdateInformationDto.first_name
      ? customerUpdateInformationDto.first_name
      : currentUser.first_name;

    // last_name
    currentUser.last_name = customerUpdateInformationDto.last_name
      ? customerUpdateInformationDto.last_name
      : currentUser.last_name;

    // email
    currentUser.email = customerUpdateInformationDto.email
      ? customerUpdateInformationDto.email
      : currentUser.email;

    // about
    currentUser.about = customerUpdateInformationDto.about
      ? customerUpdateInformationDto.about
      : currentUser.about;

    // city_address
    currentUser.city_address = customerUpdateInformationDto.city_address
      ? customerUpdateInformationDto.city_address
      : currentUser.city_address;

    // district_address
    currentUser.district_address = customerUpdateInformationDto.district_address
      ? customerUpdateInformationDto.district_address
      : currentUser.district_address;

    // specific_address
    currentUser.specific_address = customerUpdateInformationDto.specific_address
      ? customerUpdateInformationDto.specific_address
      : currentUser.specific_address;

    if (avatar) {
      const [fileName, fileType] = avatar.originalname.split('.');

      const uniqueFileName =
        fileName.split(' ').join('') + '-' + Date.now() + '.' + fileType;

      const avatarUrl = await this.s3Service.uploadImageToBucket(
        avatar.buffer,
        uniqueFileName,
        avatar.mimetype,
      );

      currentUser.avatar_url = avatarUrl;
    }

    await this.customerRepository.save(currentUser);

    const userRoles: SystemRole[] = currentUser.auth_credential.roles.map(
      (role) => role.role_title,
    );

    currentUser.user_roles = userRoles;

    return {
      updatedUser: plainToInstance(Staff, currentUser),
    };
  }

  async deleteMe(user: JwtPayload) {
    const { authId } = user;

    const currentUser = await this.authCredentialRepository.findOne({
      where: {
        id: authId,
      },
    });

    await this.authCredentialRepository.remove(currentUser);

    return {
      message: `Delete user successfully`,
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
        car_posts: {
          car: {
            car_galleries: true,
          },
        },
      },
    });

    if (wishlist) {
      return {
        total_posts_in_wishlist: wishlist.car_posts.length,
        wishlist: plainToInstance(CustomerWishlist, wishlist),
      };
    }

    throw new NotFoundException(`user's wishlist is not found`);
  }

  async addToWishlist(user: JwtPayload, postId: number) {
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
        car_posts: {
          car: {
            car_galleries: true,
          },
        },
      },
    });

    const currentPost = await this.carPostRepository.findOneBy({
      id: postId,
    });

    if (currentPost) {
      let postInWishlist = false;

      for (let i = 0; i < wishlist.car_posts.length; i++) {
        const carPost = wishlist.car_posts[i];
        if (carPost.id === Number(postId)) {
          postInWishlist = true;
          break;
        }
      }

      if (!postInWishlist) {
        wishlist.car_posts.push(currentPost);
        await this.customerWishlistRepository.save(wishlist);
      }

      return {
        total_posts_in_wishlist: wishlist.car_posts.length,
        wishlist: plainToInstance(CustomerWishlist, wishlist),
      };
    }
  }

  async removeFromWishlist(user: JwtPayload, postId: number) {
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
        car_posts: {
          car: {
            car_galleries: true,
          },
        },
      },
    });

    const currentPost = await this.carPostRepository.findOneBy({
      id: postId,
    });

    if (currentPost) {
      for (let i = 0; i < wishlist.car_posts.length; i++) {
        const carPost = wishlist.car_posts[i];
        if (carPost.id === Number(postId)) {
          wishlist.car_posts.splice(i, 1);
          this.customerWishlistRepository.save(wishlist);
          break;
        }
      }

      return {
        total_posts_in_wishlist: wishlist.car_posts.length,
        wishlist: plainToInstance(CustomerWishlist, wishlist),
      };
    }
  }

  async getOtherCustomer(customerId: number) {
    const customer = await this.customerRepository.findOne({
      where: {
        id: Number(customerId),
      },
    });

    return {
      customer: customer,
    };
  }
}
