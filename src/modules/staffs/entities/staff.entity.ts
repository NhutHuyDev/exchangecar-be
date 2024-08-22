import { AuthCredential } from 'src/modules/auth/entities/auth_credential.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from '../../customer/entities/address.entity';
import { Exclude } from 'class-transformer';
import { CarPost } from '@/modules/carPosts/entities/car_post.entity';

@Entity('Staffs')
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  first_name: string;

  @Column({ type: 'varchar' })
  last_name: string;

  @Column({ type: 'varchar' })
  mobile_phone: string;

  @Column({ type: 'text' })
  email: string;

  @OneToOne(() => Address)
  @JoinColumn()
  address: Address;

  @Column({ type: 'text', nullable: true })
  avatar_url: string;

  @Column({ type: 'int', default: 0 })
  total_sold_car: number;

  @Exclude()
  @OneToOne(() => AuthCredential, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  auth_credential: AuthCredential;

  @OneToMany(() => CarPost, (CarPost) => CarPost.staff, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  car_posts: CarPost[];

  @Column({
    type: 'timestamp',
    default: new Date(),
  })
  hired_date: Date;
}
