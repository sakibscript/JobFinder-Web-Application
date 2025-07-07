// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   JoinColumn,
// } from 'typeorm';
// import { JobSeeker } from './job_seeker.entity';

// @Entity()
// export class Subscription {
//   @PrimaryGeneratedColumn()
//   subscriptionId: number;

//   @Column()
//   jobSeekerId: number;

//   @Column({ default: false })
//   isPremium: boolean;

//   @Column({ type: 'timestamp', nullable: true })
//   expiresAt: Date;

//   @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.subscription)
//   @JoinColumn({ name: 'jobSeekerId' })
//   jobSeeker: JobSeeker;
// }

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { JobSeeker } from './job_seeker.entity';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  jobSeekerId: number;

  @Column({ default: false })
  isPremium: boolean;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.subscription)
  @JoinColumn({ name: 'jobSeekerId' })
  jobSeeker: JobSeeker;
}
