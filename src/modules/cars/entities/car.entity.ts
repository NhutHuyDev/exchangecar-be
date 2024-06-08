import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CarVariantSpec } from './Car_Variant_Specs.entity';
import { CarGallery } from './car_galleries.entity';

export enum CarOrigin {
  CKD = 'Completely Knocked Down (CKD)',
  CBU = 'Completely Built Unit (CBU)',
}

export enum CarStatus {
  OLD = 'old',
  NEW = 'new',
}

@Entity('Cars')
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  car_name: string;

  @Column({ type: 'varchar' })
  car_brand: string;

  @Column({ type: 'varchar' })
  car_model: string;

  @Column({ type: 'varchar' })
  car_variant: string;

  @Column({ type: 'int' })
  manufacturing_date: number;

  @OneToMany(() => CarGallery, (CarGallery) => CarGallery.car)
  car_galleries: CarGallery[];

  @ManyToOne(() => CarVariantSpec)
  @JoinColumn()
  car_specs: CarVariantSpec;

  @Column({ type: 'int', nullable: true })
  car_mileage: number;

  @Column({ type: 'text' })
  description: number;

  @Column({ type: 'varchar' })
  city: string;

  @Column({ type: 'varchar', nullable: true })
  district: string;

  @Column({
    type: 'enum',
    enum: CarOrigin,
  })
  car_origin: CarOrigin;

  @Column({
    type: 'enum',
    enum: CarStatus,
  })
  car_status: CarStatus;

  @Column({ type: 'int' })
  selling_price: number;
}
