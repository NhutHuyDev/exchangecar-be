import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { City } from './city.entity';
import { District } from './district.entity';

@Entity('Addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  specific_address: string;

  @ManyToOne(() => City, (City) => City.Addresses)
  city: City;

  @ManyToOne(() => District, (District) => District.Addresses)
  district: District;
}
