import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { JobSeeker } from './job_seeker.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  paymentId: number;

  @Column()
  jobSeekerId: number;

  @Column()
  transactionId: string;

  @Column()
  amount: number;

  @Column()
  status: string;

  @Column({ nullable: true })
  bankTransactionId?: string;

  @Column({ nullable: true })
  currency?: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.payments)
  @JoinColumn({ name: 'jobSeekerId' })
  jobSeeker: JobSeeker;
}
