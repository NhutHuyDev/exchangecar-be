import {
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { CarPost } from '@/modules/carPosts/entities/car_post.entity';
import { Exclude } from 'class-transformer';

@Entity('Customer_Wishlists')
export class CustomerWishlist {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Customer, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  customer: Customer;

  @ManyToMany(() => CarPost, (CarPost) => CarPost.wishlist)
  car_posts: CarPost[];
}
