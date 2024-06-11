import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Session } from './session.entity';
import { Exclude } from 'class-transformer';
import { Role } from './role.entity';

@Entity('Auth_Credentials')
export class AuthCredential {
  static readonly SaltOrRounds = 10;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  cred_login: string;

  @Exclude()
  @Column({ type: 'varchar' })
  cred_password: string;

  @Column({ type: 'varchar', nullable: true })
  password_reset_otp: string;

  @Column({ type: 'timestamp', nullable: true })
  password_reset_expiry: Date;

  @ManyToMany(() => Role)
  @JoinTable({ name: 'Auth_Roles' })
  roles: Role[];

  @OneToMany(() => Session, (session) => session.auth_credential)
  sessions: Session[];
}
