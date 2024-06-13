import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { District } from './district.entity';
import { Address } from './address.entity';

@Entity('Cities')
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unique: true })
  city_code: number;

  @Column({ type: 'varchar', unique: true })
  city_name: string;

  @Column({ type: 'varchar', unique: true })
  city_param: string;

  @OneToMany(() => District, (District) => District.city)
  districts: District[];

  @OneToMany(() => Address, (Address) => Address.city)
  Addresses: Address[];
}
