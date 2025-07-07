import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { JobSeeker } from './job_seeker.entity';
import { JobApplication } from './job_application.entity';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  jobId: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column()
  category: string;

  @Column()
  company: string;

  @Column('decimal')
  salary: number;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @OneToMany(() => JobApplication, (jobApplication) => jobApplication.job)
  jobApplications: JobApplication[];
}
