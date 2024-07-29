import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthCredential } from './auth_credential.entity';

@Entity('Sessions')
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AuthCredential, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  auth_credential: AuthCredential;

  @Column({ type: 'text' })
  refresh_token: string;

  @Column({ type: 'boolean', default: true })
  is_available: boolean;
}
