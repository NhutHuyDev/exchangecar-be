import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Session } from './session.entity';

@Entity('Auth_Credentials')
export class AuthCredential {
  static readonly SaltOrRounds = 10;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  cred_login: string;

  @Column({ type: 'varchar' })
  cred_password: string;

  @Column({ type: 'varchar', length: 6, nullable: true })
  password_reset_otp: string;

  @Column({ type: 'timestamp', nullable: true })
  password_reset_expiry: Date;

  @OneToMany(() => Session, (session) => session.auth_credential)
  sessions: Session[];
}
