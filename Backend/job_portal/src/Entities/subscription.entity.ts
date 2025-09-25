import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { JobSeeker } from './job_seeker.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn()
  subscriptionId: number;

  @Column()
  jobSeekerId: number;

  @Column({ default: false })
  isPremium: boolean;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.subscription, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'jobSeekerId' })
  jobSeeker: JobSeeker;
}
