import { AuthCredential } from 'src/modules/auth/entities/auth_credential.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from '../../customer/entities/address.entity';

@Entity('Staffs')
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  first_name: string;

  @Column({ type: 'varchar' })
  last_name: string;

  @Column({ type: 'varchar' })
  mobile_phone: string;

  @Column({ type: 'text' })
  email: string;

  @OneToOne(() => Address)
  @JoinColumn()
  address: Address;

  @Column({ type: 'text', nullable: true })
  avatar_url: string;

  @OneToOne(() => AuthCredential, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  auth_credential: AuthCredential;

  @Column({
    type: 'timestamp',
    default: new Date(),
  })
  hired_date: Date;
}
