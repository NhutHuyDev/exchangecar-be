import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CarModel } from './car_model.entity';

@Entity('Car_Brands')
export class CarBrand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  brand_name: string;

  @Column({ type: 'varchar', unique: true })
  brand_param: string;

  @Column({ type: 'text' })
  logo_url: string;

  @OneToMany(() => CarModel, (CarModel) => CarModel.car_brand)
  car_models: CarModel[];
}
