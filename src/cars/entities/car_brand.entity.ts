import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CarModel } from './car_model.entity';

@Entity('Car_Brands')
export class CarBrand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  brand_name: string;

  @Column({ type: 'text' })
  brand_url: string;

  @OneToMany(() => CarModel, (CarModel) => CarModel.car_brand)
  car_models: CarModel[];
}
