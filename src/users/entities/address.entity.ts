import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  specific_address: string;

  @Column({ type: 'varchar' })
  city: string;

  @Column({ type: 'varchar' })
  district: string;
}
