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
import { PostTransaction } from '@/modules/payment/entities/transaction.entity';
import { Staff } from '@/modules/staffs/entities/staff.entity';
import SystemPackageOptions from '@/constraints/systemPackage.enum.constraint';

export enum CarPostStatus {
  DRAFT = 'Draft',
  ACTIVE = 'Active',
  EXPRIED = 'Expired',
  DELETED = 'Soft Deleted',
}

@Entity('Car_Posts')
export class CarPost {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (Customer) => Customer.car_posts, {
    onDelete: 'CASCADE',
  })
  customer: Customer;

  @ManyToOne(() => Staff, (Staff) => Staff.car_posts, {
    onDelete: 'CASCADE',
  })
  staff: Staff;

  @OneToOne(() => Car, { cascade: true, onUpdate: 'CASCADE' })
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

  @Column({ type: 'int', nullable: true })
  days_displayed: number;

  @Column({ type: 'timestamp', nullable: true })
  expired_at: Date;

  @Column({ type: 'varchar', default: CarPostStatus.DRAFT })
  post_status: CarPostStatus;

  @Column({ type: 'varchar', nullable: true })
  package_option: SystemPackageOptions;

  @Column({ type: 'int', default: 0 })
  total_view: number;

  @Column({ type: 'int', default: 0 })
  total_like: number;

  @OneToMany(
    () => PostTransaction,
    (PostTransaction) => PostTransaction.car_post,
    {
      cascade: true,
      onDelete: 'NO ACTION',
    },
  )
  post_transactions: PostTransaction[];

  @ManyToMany(
    () => CustomerWishlist,
    (CustomerWishlist) => CustomerWishlist.car_posts,
    { cascade: true },
  )
  @JoinTable({ name: 'Wishlist_Posts' })
  wishlist: CustomerWishlist[];
}
