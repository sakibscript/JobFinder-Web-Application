import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { JobSeeker } from './job_seeker.entity';

@Entity()
export class Interview {
  @PrimaryGeneratedColumn()
  interviewId: number;

  @Column()
  role: string;

  @Column()
  date: string;

  @Column()
  time: string;

  @Column()
  type: string;

  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.interviews, {
    onDelete: 'CASCADE',
  })
  jobSeeker: JobSeeker;
}
