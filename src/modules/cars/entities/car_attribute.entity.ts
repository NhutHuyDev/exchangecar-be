import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CarAttributeOption } from './car_attribute_option.entity';

@Entity('Car_Attributes')
export class CarAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  attribute_name: string;

  @Column({ type: 'varchar', unique: true })
  attribute_title: string;

  @OneToMany(
    () => CarAttributeOption,
    (CarAttributeOptions) => CarAttributeOptions.attribute,
  )
  attribute_options: CarAttributeOption[];
}
