import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthCredential } from './auth_credential.entity';

@Entity('Key_Store')
export class KeyStore {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => AuthCredential)
  @JoinColumn()
  auth_credential: AuthCredential;

  @Column({ type: 'text' })
  public_key: string;

  @Column({ type: 'text' })
  private_key: string;
}
