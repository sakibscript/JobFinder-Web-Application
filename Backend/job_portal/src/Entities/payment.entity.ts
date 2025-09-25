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

export enum PaymentStatus {
  PENDING = 'Pending',
  SUCCESS = 'Success',
  FAILED = 'Failed',
  CANCELLED = 'Cancelled',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  paymentId: number;

  @Column()
  jobSeekerId: number;

  @Column({ unique: true })
  transactionId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ nullable: true })
  bankTransactionId?: string;

  @Column({ nullable: true })
  currency?: string;

  @Column({ nullable: true })
  plan?: string;

  @Column({ nullable: true })
  paymentMethod?: string;

  @Column({ nullable: true })
  fullName?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  address?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'jobSeekerId' })
  jobSeeker: JobSeeker;
}
