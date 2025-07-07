import { Module } from '@nestjs/common';
import { JobApplicationsService } from './job_applications.service';
import { JobApplicationsController } from './job_applications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplication } from 'src/Entities/job_application.entity';
import { Job } from 'src/Entities/job.entity';
import { JobSeeker } from 'src/Entities/job_seeker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobApplication, Job, JobSeeker])],
  providers: [JobApplicationsService],
  controllers: [JobApplicationsController],
})
export class JobApplicationsModule {}
