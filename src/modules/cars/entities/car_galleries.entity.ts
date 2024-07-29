import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Car } from './car.entity';

@Entity('Car_Galleries')
export class CarGallery {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Car, (Car) => Car.car_galleries, { onDelete: 'CASCADE' })
  car: Car;

  @Column({ type: 'varchar' })
  file_name: string;

  @Column({ type: 'text' })
  gallery_url: string;
}
