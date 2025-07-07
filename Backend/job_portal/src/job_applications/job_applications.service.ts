import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from 'src/Entities/job.entity';
import { JobSeeker } from 'src/Entities/job_seeker.entity';
import { JobApplicationDTO } from 'src/DTOs/job_application.dto';
import { JobApplication } from 'src/Entities/job_application.entity';
import { CreateJobSeekerDto } from 'src/DTOs/create_job_seeker.dto';
import { AddMessageDto } from 'src/DTOs/add-message.dto';

@Injectable()
export class JobApplicationsService {
  constructor(
    @InjectRepository(JobApplication)
    private jobApplicationRepo: Repository<JobApplication>,

    @InjectRepository(Job)
    private jobRepo: Repository<Job>,

    @InjectRepository(JobSeeker)
    private jobSeekerRepo: Repository<JobSeeker>,
  ) {}

  // async applyToJob(dto: JobApplicationDTO): Promise<JobApplication> {
  //   const job = await this.jobRepo.findOne({ where: { jobId: dto.jobId } });
  //   const jobSeeker = await this.jobSeekerRepo.findOne({
  //     where: { jobSeekerId: dto.jobSeekerId },
  //   });

  //   jobSeeker: CreateJobSeekerDto;
  //   if (!job || !jobSeeker)
  //     throw new NotFoundException('Job or JobSeeker not found');
  //   if (jobSeeker.resumeUrl === null) {
  //     throw new NotFoundException('Upload your resume first');
  //   }

  //   const jobApplication = this.jobApplicationRepo.create({
  //     job,
  //     jobSeeker: jobSeeker,
  //     status: 'applied',
  //     coverLetter: dto.coverLetter,
  //   });

  //   return this.jobApplicationRepo.save(jobApplication);
  // }

  async applyToJob(dto: JobApplicationDTO): Promise<JobApplication> {
    const job = await this.jobRepo.findOne({ where: { jobId: dto.jobId } });
    const jobSeeker = await this.jobSeekerRepo.findOne({
      where: { jobSeekerId: dto.jobSeekerId },
    });

    if (!job || !jobSeeker) {
      throw new NotFoundException('Job or JobSeeker not found');
    }

    if (!jobSeeker.resumeUrl) {
      throw new NotFoundException('Upload your resume first');
    }

    // ✅ Check for duplicate application
    const existing = await this.jobApplicationRepo.findOne({
      where: {
        job: { jobId: dto.jobId },
        jobSeeker: { jobSeekerId: dto.jobSeekerId },
      },
    });

    if (existing) {
      throw new ConflictException('You’ve already applied for this job.');
    }

    const jobApplication = this.jobApplicationRepo.create({
      job,
      jobSeeker,
      status: 'applied',
      coverLetter: dto.coverLetter,
    });

    return this.jobApplicationRepo.save(jobApplication);
  }

  // async getRecentApplicationsByJobSeeker(
  //   jobSeekerId: number,
  // ): Promise<JobApplication[]> {
  //   return this.jobApplicationRepo.find({
  //     where: { jobSeeker: { jobSeekerId } },
  //     relations: ['job'],
  //     order: { appliedAt: 'DESC' },
  //     take: 5,
  //   });
  // }

  async getRecentApplicationsByJobSeeker(jobSeekerId: number) {
    const apps = await this.jobApplicationRepo.find({
      where: { jobSeeker: { jobSeekerId } },
      relations: ['job'], // Include job data
      order: { appliedAt: 'DESC' }, // Sort by recent
      take: 5, // Limit to most recent 5
    });

    return apps.map((app) => ({
      jobApplicationId: app.jobApplicationId,
      status: app.status,
      appliedAt: app.appliedAt,
      job: {
        title: app.job?.title || 'Unknown',
        company: app.job?.company || 'Unknown',
      },
    }));
  }

  async applicationTracking(
    jobApplicationId: number,
    dto: JobApplicationDTO,
  ): Promise<JobApplication> {
    const application = await this.jobApplicationRepo.findOne({
      where: { jobApplicationId },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    application.status = dto.status;
    application.employerAction = dto.employerAction ?? '';
    application.followUpReminderDate = dto.followUpReminderDate
      ? new Date(dto.followUpReminderDate)
      : null;

    return this.jobApplicationRepo.save(application);
  }

  // src/job-applications/job-applications.service.ts
  async addMessage2(applicationId: number, dto: AddMessageDto) {
    const app = await this.jobApplicationRepo.findOneBy({
      jobApplicationId: applicationId,
    });

    if (!app) throw new NotFoundException('Application not found');

    const newMessage = {
      ...dto,
      unread: dto.unread ?? true,
      createdAt: new Date().toISOString(),
    };

    app.messages = [...(app.messages || []), newMessage];
    return this.jobApplicationRepo.save(app);
  }

  async getRecentMessages(jobSeekerId: number) {
    const apps = await this.jobApplicationRepo.find({
      where: { jobSeeker: { jobSeekerId: jobSeekerId } },
      order: { appliedAt: 'DESC' },
      relations: ['job'],
      take: 10,
    });

    // Flatten and attach job info
    return apps
      .flatMap((app) =>
        (app.messages || []).map((msg) => ({
          sender: app.job?.company || 'Recruiter',
          preview: msg.preview,
          unread: msg.unread,
          createdAt: msg.createdAt,
        })),
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }
  // job-applications.service.ts

  async addMessage(
    jobApplicationId: number,
    message: {
      sender: string;
      preview: string;
      unread?: boolean;
    },
  ) {
    const app = await this.jobApplicationRepo.findOneBy({
      jobApplicationId,
    });

    if (!app) {
      throw new NotFoundException('Job application not found');
    }

    const newMessage = {
      ...message,
      unread: message.unread ?? true,
      createdAt: new Date().toISOString(),
    };

    app.messages = [...(app.messages || []), newMessage];

    return this.jobApplicationRepo.save(app);
  }
}
