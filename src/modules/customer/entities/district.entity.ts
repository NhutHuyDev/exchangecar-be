import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { City } from './city.entity';
import { Address } from './address.entity';

@Entity('Districts')
export class District {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  district_name: string;

  @Column({ type: 'varchar', unique: true })
  district_param: string;

  @ManyToOne(() => City, (CarBrand) => CarBrand.districts)
  city: City;

  @OneToMany(() => Address, (Address) => Address.district)
  Addresses: Address[];
}
