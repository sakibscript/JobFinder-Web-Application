import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { JobApplication } from './job_application.entity';
import { Payment } from './payment.entity';
import { Subscription } from './subscription.entity';
import { Interview } from './interview.entity';

@Entity()
export class JobSeeker {
  @PrimaryGeneratedColumn()
  jobSeekerId: number;

  @Column({ length: 100 })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  resumeUrl?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ default: 'jobseeker' })
  role: 'jobseeker' | 'employer' | 'admin';

  @Column({ type: 'varchar', nullable: true })
  resetToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiry: Date | null;

  @Column({ type: 'varchar', nullable: true })
  sessionToken: string | null;

  @OneToMany(() => JobApplication, (jobApplication) => jobApplication.jobSeeker)
  jobApplications: JobApplication[];

  @OneToMany(() => Payment, (payment) => payment.jobSeeker)
  payments: Payment[];

  @OneToOne(() => Subscription, (subscription) => subscription.jobSeeker)
  subscription: Subscription;

  // src/job-seekers/entities/job-seeker.entity.ts
  @OneToMany(() => Interview, (interview) => interview.jobSeeker)
  interviews: Interview[];
}
