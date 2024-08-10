import { CarPost } from '@/modules/carPosts/entities/car_post.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Post_Transaction')
export class PostTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  transaction_id: string;

  @ManyToOne(() => CarPost, (CarPost) => CarPost.post_transactions, {
    onDelete: 'CASCADE',
  })
  car_post: CarPost;

  @Column({ type: 'int' })
  days_displayed: number;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'timestamp', default: new Date() })
  created_at: Date;

  @Column({ type: 'varchar' })
  payment_method: string;
}
