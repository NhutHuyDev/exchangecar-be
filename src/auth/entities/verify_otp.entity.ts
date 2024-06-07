import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum VerifyType {
  PHONE = 'phone',
  EMAIL = 'email',
}

@Entity('Verify_OTP')
export class VerifyOTP {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: VerifyType,
    default: VerifyType.PHONE,
  })
  verify_type: VerifyType;

  @Column({ type: 'varchar' })
  verify_info: string;

  @Column({ type: 'varchar', length: 6, nullable: true })
  current_otp: string;

  @Column({ type: 'timestamp', nullable: true })
  otp_expiry: Date;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;
}
