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

  @Column({ type: 'varchar' })
  district_name: string;

  @Column({ type: 'varchar' })
  district_param: string;

  @Column({ type: 'int', unique: true })
  district_code: number;

  @ManyToOne(() => City, (City) => City.districts)
  city: City;

  @OneToMany(() => Address, (Address) => Address.district)
  Addresses: Address[];
}
