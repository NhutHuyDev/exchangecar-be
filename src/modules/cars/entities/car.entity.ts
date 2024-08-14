import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CarGallery } from './car_galleries.entity';
import { CarPost } from '@/modules/carPosts/entities/car_post.entity';

export enum CarOrigin {
  CKD = 'Nhập khẩu',
  CBU = 'Lắp ráp trong nước',
}

export enum CarStatus {
  OLD = 'Đã qua sử dụng',
  NEW = 'Xe mới',
}

@Entity('Cars')
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ fulltext: true })
  @Column({ type: 'varchar' })
  car_name: string;

  @Column({ type: 'varchar' })
  car_brand: string;

  @Column({ type: 'varchar' })
  car_model: string;

  @Column({ type: 'varchar', nullable: true })
  car_variant: string;

  @Column({ type: 'text' })
  car_slug: string;

  @Column({ type: 'int' })
  manufacturing_date: number;

  @Column({ type: 'varchar' })
  body_type: string;

  @Column({ type: 'int', nullable: true })
  car_mileage: number;

  @Column({ type: 'varchar' })
  transmission: string;

  @Column({ type: 'varchar' })
  engine_type: string;

  @Column({ type: 'varchar' })
  out_color: string;

  @Column({ type: 'varchar' })
  drivetrain: string;

  @Column({ type: 'int' })
  total_seating: number;

  @Column({ type: 'int' })
  total_doors: number;

  @Column({ type: 'varchar' })
  city: string;

  @Column({ type: 'varchar', nullable: true })
  district: string;

  @Column({ type: 'varchar' })
  car_origin: CarOrigin;

  @Column({ type: 'varchar' })
  car_status: CarStatus;

  @Index({ fulltext: true })
  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  selling_price: number;

  @OneToMany(() => CarGallery, (CarGallery) => CarGallery.car)
  car_galleries: CarGallery[];

  @OneToOne(() => CarPost, { cascade: true, onUpdate: 'CASCADE' })
  @JoinColumn()
  car_post: CarPost;
}
