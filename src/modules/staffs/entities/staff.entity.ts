import { AuthCredential } from 'src/modules/auth/entities/auth_credential.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from '../../users/entities/address.entity';
import { CarPost } from 'src/modules/posts/entities/car_post.entity';
import { Role } from 'src/modules/auth/entities/role.entity';

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

  @Column({ type: 'varchar' })
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

  @ManyToMany(() => Role, (Role) => Role.staffs)
  @JoinTable({ name: 'Staff_Roles' })
  roles: Role[];

  @Column({
    type: 'timestamp',
    default: new Date(),
  })
  hired_date: Date;
}
