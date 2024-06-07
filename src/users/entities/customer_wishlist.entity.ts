import {
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { CarPost } from 'src/posts/entities/car_post.entity';

@Entity('Customer_Wishlists')
export class CustomerWishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Customer)
  @JoinColumn()
  customer: Customer;

  @ManyToMany(() => CarPost, (CarPost) => CarPost.customer_wishlists)
  car_posts: CarPost[];
}
