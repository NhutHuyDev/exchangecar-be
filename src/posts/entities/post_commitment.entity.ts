import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CarPost } from './car_post.entity';

@Entity('Car_Post_Commitments')
export class CarPostCommitments {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CarPost, (CarPost) => CarPost.post_commitments)
  car_post: CarPost;

  @Column({ type: 'text' })
  commitment: string;
}
