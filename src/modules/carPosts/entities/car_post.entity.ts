import { Car } from 'src/modules/cars/entities/car.entity';
import { Customer } from '@/modules/customer/entities/customer.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CarPostCommitments } from './post_commitment.entity';
import { CustomerWishlist } from '@/modules/customer/entities/customer_wishlist.entity';

export enum CarPostStatus {
  DRAFT = 'draft',
  WAITING_TO_PAY = 'Wait to pay',
  POSTED = 'posted',
  UN_POSTED = 'unposted',
  EXPRIED = 'expired',
}

@Entity('Car_Posts')
export class CarPost {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (Customer) => Customer.car_posts)
  customer: Customer;

  @OneToOne(() => Car)
  @JoinColumn()
  car: Car;

  @OneToMany(
    () => CarPostCommitments,
    (CarPostCommitments) => CarPostCommitments.car_post,
  )
  post_commitments: CarPostCommitments[];

  @Column({ type: 'timestamp', default: new Date() })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  posted_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  expired_at: Date;

  @Column({ type: 'varchar', default: CarPostStatus.DRAFT })
  post_status: CarPostStatus;

  @ManyToMany(
    () => CustomerWishlist,
    (CustomerWishlist) => CustomerWishlist.car_posts,
    { cascade: true },
  )
  @JoinTable({ name: 'Wishlist_Posts' })
  customer_wishlists: CustomerWishlist[];
}
