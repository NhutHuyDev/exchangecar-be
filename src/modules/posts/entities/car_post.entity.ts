import { Car } from 'src/modules/cars/entities/car.entity';
import { Customer } from 'src/modules/users/entities/customer.entity';
import { Staff } from 'src/modules/staffs/entities/staff.entity';
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
import { CustomerWishlist } from 'src/modules/users/entities/customer_wishlist.entity';

export enum CarPostStatus {
  DRAFT = 'draft',
  WAITING_APPROVAL = 'waiting approval',
  APPROVED = 'approved',
  EXPRIED = 'expired',
}

@Entity('Car_Posts')
export class CarPost {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (Customer) => Customer.car_posts)
  customer: Customer;

  @ManyToOne(() => Staff, (Staff) => Staff.car_posts)
  staff: Staff;

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

  @Column({ type: 'timestamp' })
  expired_at: Date;

  @Column({
    type: 'enum',
    enum: CarPostStatus,
  })
  status: CarPostStatus;

  @ManyToMany(
    () => CustomerWishlist,
    (CustomerWishlist) => CustomerWishlist.car_posts,
    { cascade: true },
  )
  @JoinTable({ name: 'Wishlist_Posts' })
  customer_wishlists: CustomerWishlist[];
}
