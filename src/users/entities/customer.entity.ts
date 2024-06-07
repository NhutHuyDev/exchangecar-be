import { AuthCredential } from 'src/auth/entities/auth_credential.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from './address.entity';
import { CarPost } from 'src/posts/entities/car_post.entity';

export enum CustomerType {
  INDIVIDUAL = 'individual',
  SHOWROOM = 'showroom',
}

@Entity('Customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  first_name: string;

  @Column({ type: 'varchar' })
  last_name: string;

  @Column({ type: 'varchar', length: 10 })
  mobile_phone: string;

  @Column({ type: 'text', nullable: true })
  email: string;

  @OneToOne(() => Address)
  @JoinColumn()
  address: Address;

  @Column({ type: 'text', nullable: true })
  avatar_url: string;

  @Column({ type: 'text', nullable: true })
  about: string;

  @OneToOne(() => AuthCredential)
  @JoinColumn()
  auth_credential: AuthCredential;

  @OneToMany(() => CarPost, (CarPost) => CarPost.customer)
  car_posts: CarPost[];

  @Column({
    type: 'enum',
    enum: CustomerType,
    default: CustomerType.INDIVIDUAL,
  })
  customer_type: CustomerType;

  @Column({
    type: 'timestamp',
    default: new Date(),
  })
  created_at: Date;
}
