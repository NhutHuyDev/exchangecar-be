import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CarBrand } from './car_brand.entity';
import { CarVariantSpec } from './car_variant_specs.entity';

@Entity('Car_Models')
export class CarModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CarBrand, (CarBrand) => CarBrand.car_models)
  car_brand: CarBrand;

  @Column({ type: 'varchar', unique: true })
  model_name: string;

  @Column({ type: 'varchar', unique: true })
  model_param: string;

  @OneToMany(() => CarVariantSpec, (CarVariantSpec) => CarVariantSpec.car_model)
  car_variant_specs: CarVariantSpec[];
}
