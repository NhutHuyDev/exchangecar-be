import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CarBrand } from './car_brand.entity';
import { CarVariantSpec } from './Car_Variant_Specs.entity';

@Entity('Car_Models')
export class CarModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CarBrand, (CarBrand) => CarBrand.car_models)
  car_brand: CarBrand;

  @Column({ type: 'varchar' })
  model_name: string;

  @OneToMany(() => CarVariantSpec, (CarVariantSpec) => CarVariantSpec.car_model)
  car_variant_specs: CarVariantSpec[];
}
