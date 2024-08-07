import { CarPost } from '@/modules/carPosts/entities/car_post.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Post_Transaction')
export class PostTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unique: true })
  transaction_id: number;

  @ManyToOne(() => CarPost, (CarPost) => CarPost.post_transactions, {
    onDelete: 'CASCADE',
  })
  car_post: CarPost;

  @Column({ type: 'int' })
  days_displayed: number;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'timestamp' })
  expired_at: Date;

  @Column({ type: 'varchar' })
  payment_method: string;
}
