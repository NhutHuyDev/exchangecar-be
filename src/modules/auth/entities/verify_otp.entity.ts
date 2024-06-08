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

  @Column({ type: 'varchar', unique: true })
  verify_info: string;

  @Column({ type: 'varchar', nullable: true })
  current_otp: string;

  @Column({ type: 'timestamp', nullable: true })
  otp_expiry: Date;
}
