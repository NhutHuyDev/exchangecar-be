import { CarAttribute } from './car_attribute.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Car_Attribute_Options')
export class CarAttributeOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  option_value: string;

  @Column({ type: 'varchar', unique: true })
  option_param: string;

  @Column({ type: 'text', nullable: true })
  option_icon: string;

  @ManyToOne(
    () => CarAttribute,
    (CarAttribute) => CarAttribute.attribute_options,
  )
  attribute: CarAttribute;
}
