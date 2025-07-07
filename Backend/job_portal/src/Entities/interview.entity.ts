// src/interviews/entities/interview.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { JobSeeker } from './job_seeker.entity';

@Entity()
export class Interview {
  @PrimaryGeneratedColumn()
  interviewId: number;

  @Column()
  role: string;

  @Column()
  date: string; // e.g., "25 June, 10:00 AM"

  @Column()
  time: string;

  @Column()
  type: string; // e.g., Zoom, In-Person, etc.

  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.interviews, {
    onDelete: 'CASCADE',
  })
  jobSeeker: JobSeeker;
}
