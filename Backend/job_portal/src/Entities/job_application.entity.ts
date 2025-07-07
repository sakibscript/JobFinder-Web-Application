import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Job } from './job.entity';
import { JobSeeker } from './job_seeker.entity';

@Entity()
export class JobApplication {
  @PrimaryGeneratedColumn({ name: 'job_application_id' })
  jobApplicationId: number;

  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.jobApplications)
  jobSeeker: JobSeeker;

  @ManyToOne(() => Job, (job) => job.jobApplications)
  job: Job;

  @Column({ nullable: true })
  coverLetter: string;

  @CreateDateColumn()
  appliedAt: Date;

  @Column({ nullable: true })
  employerAction: string;

  @Column({ nullable: true, type: 'timestamp' })
  followUpReminderDate: Date | null;

  @Column({ default: 'applied' })
  status: string;

  @Column({ nullable: true })
  approvalMessage: string;

  @Column('jsonb', { nullable: true, default: [] })
  messages: {
    sender: string;
    preview: string;
    unread: boolean;
    createdAt: string;
  }[];
}
