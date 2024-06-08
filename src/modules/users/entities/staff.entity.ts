import { AuthCredential } from 'src/modules/auth/entities/auth_credential.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from './address.entity';
import { CarPost } from 'src/modules/posts/entities/car_post.entity';

export enum StaffType {
  INFORMATION = 'information',
  MARKETING = 'marketing',
}

@Entity('Staffs')
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  first_name: string;

  @Column({ type: 'varchar' })
  last_name: string;

  @Column({ type: 'varchar', length: 10 })
  mobile_phone: string;

  @Column({ type: 'text' })
  email: string;

  @OneToOne(() => Address)
  @JoinColumn()
  address: Address;

  @Column({ type: 'text', nullable: true })
  avatar_url: string;

  @OneToOne(() => AuthCredential)
  @JoinColumn()
  auth_credential: AuthCredential;

  @OneToMany(() => CarPost, (CarPost) => CarPost.staff)
  car_posts: CarPost[];

  @Column({
    type: 'enum',
    enum: StaffType,
    default: StaffType.INFORMATION,
  })
  staff_type: StaffType;

  @Column({
    type: 'timestamp',
    default: new Date(),
  })
  hired_date: Date;
}
