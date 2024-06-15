import SystemRole from '@/constraints/systemRoles.enum.constraint';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: SystemRole,
  })
  role_title: SystemRole;
}
