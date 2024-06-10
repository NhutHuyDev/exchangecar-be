import { Staff } from '@/modules/staffs/entities/staff.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  role_title: string;

  @ManyToMany(() => Staff, (Staff) => Staff.roles)
  staffs: Staff[];
}
