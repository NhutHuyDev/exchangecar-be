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

  @Column({ type: 'varchar' })
  body_type: string;

  @Column({ type: 'int', nullable: true })
  doors: number;

  @Column({ type: 'int', nullable: true })
  total_seating: number;

  @Column({ type: 'real', nullable: true })
  wheelbase: number;

  @Column({ type: 'real', nullable: true })
  engine_size: number;

  @Column({ type: 'int', nullable: true })
  horsepower_hp: number;

  @Column({ type: 'int', nullable: true })
  touque: number;

  @Column({ type: 'varchar', nullable: true })
  drive_type: string;

  @Column({ type: 'varchar', nullable: true })
  transmission: string;

  @Column({ type: 'varchar', nullable: true })
  engine_type: string;

  @Column({ type: 'varchar', nullable: true })
  fuel_type: string;
}
