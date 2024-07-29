import { AuthCredential } from 'src/modules/auth/entities/auth_credential.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CarPost } from '@/modules/carPosts/entities/car_post.entity';
import { Exclude } from 'class-transformer';

@Entity('Customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  first_name: string;

  @Column({ type: 'varchar' })
  last_name: string;

  @Column({ type: 'varchar', unique: true })
  mobile_phone: string;

  @Column({ type: 'text', nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  city_address: string;

  @Column({ type: 'text', nullable: true })
  district_address: string;

  @Column({ type: 'text', nullable: true })
  specific_address: string;

  @Column({ type: 'text', nullable: true })
  avatar_url: string;

  @Column({ type: 'text', nullable: true })
  about: string;

  @Exclude()
  @OneToOne(() => AuthCredential, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  auth_credential: AuthCredential;

  @OneToMany(() => CarPost, (CarPost) => CarPost.customer, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  car_posts: CarPost[];

  @Column({
    type: 'timestamp',
    default: new Date(),
  })
  created_at: Date;
}
