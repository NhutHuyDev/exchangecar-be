import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CarModel } from './car_model.entity';

@Entity('Car_Variant_Specs')
export class CarVariantSpec {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  variant_name: string;

  @Column({ type: 'text' })
  variant_fullname: string;

  @ManyToOne(() => CarModel, (CarModel) => CarModel.car_variant_specs)
  car_model: CarModel;

  @Column({ type: 'int' })
  manufacturing_date: number;

  @Column({ type: 'int' })
  doors: number;

  @Column({ type: 'real' })
  wheelbase: number;

  @Column({ type: 'varchar' })
  drive_type: string;

  @Column({ type: 'varchar' })
  transmission: string;

  @Column({ type: 'real' })
  engine_size: number;

  @Column({ type: 'int' })
  horsepower_hp: number;

  @Column({ type: 'int' })
  touque: number;

  @Column({ type: 'varchar' })
  fuel_type: string;
}
