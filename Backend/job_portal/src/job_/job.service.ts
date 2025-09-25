import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Job } from 'src/Entities/job.entity';
import { JobSearchDTO } from 'src/DTOs/job_search.dto';
import { SaveJobDto } from 'src/DTOs/job_save.dto';

@Injectable()
export class JobService {
  jobRepo: any;
  jobSeekerRepo: any;
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async getAllJobs(): Promise<Job[]> {
    return this.jobRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async getJobCount(): Promise<{ count: number }> {
    const count = await this.jobRepository.count();
    return { count };
  }

  async getJobsByCategory(category: string): Promise<Job[]> {
    return this.jobRepository.find({
      where: { category },
      order: { created_at: 'DESC' },
    });
  }
  async getPopularCategories(): Promise<{ category: string; count: number }[]> {
    return this.jobRepository
      .createQueryBuilder('job')
      .select('job.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('job.category')
      .orderBy('count', 'DESC')
      .limit(6)
      .getRawMany();
  }
  async getPopularCompanies(): Promise<{ company: string; count: number }[]> {
    return this.jobRepository
      .createQueryBuilder('job')
      .select('job.company', 'company')
      .addSelect('COUNT(*)', 'count')
      .groupBy('job.company')
      .orderBy('count', 'DESC')
      .limit(6)
      .getRawMany();
  }

  async getCategories(): Promise<string[]> {
    const jobs = await this.jobRepository
      .createQueryBuilder('job')
      .select('DISTINCT job.category', 'category')
      .getRawMany();

    return jobs.map((row) => row.category);
  }

  async searchJobsByTitle(title: string, page: number, limit: number) {
    const [results, total] = await this.jobRepository.findAndCount({
      where: {
        title: ILike(`%${title}%`),
      },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        created_at: 'DESC',
      },
    });

    return {
      results,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async saveJob(dto: SaveJobDto): Promise<Job> {
    const job = await this.jobRepo.findOne({ where: { id: dto.jobId } });
    const jobSeeker = await this.jobSeekerRepo.findOne({
      where: { id: dto.jobSeekerId },
    });

    if (!job || !jobSeeker) {
      throw new NotFoundException('Job or Job Seeker not found.');
    }

    const existingSaved = await this.jobRepo.findOne({
      where: {
        job: { id: dto.jobId },
        jobSeeker: { id: dto.jobSeekerId },
      },
    });

    if (existingSaved) {
      throw new Error('You have already saved this job.');
    }

    const savedJob = this.jobRepo.create({
      job,
      jobSeeker,
    });

    return this.jobRepo.save(savedJob);
  }

  async getSavedJobsBySeeker(seekerId: number): Promise<Job[]> {
    return this.jobRepo.find({
      where: { jobSeeker: { id: seekerId } },
      relations: ['job'],
    });
  }

  async deleteSavedJob(savedJobId: number): Promise<string> {
    const savedJob = await this.jobRepo.findOne({ where: { id: savedJobId } });

    if (!savedJob) {
      throw new NotFoundException('Saved job not found.');
    }

    await this.jobRepo.remove(savedJob);
    return 'Saved job deleted successfully.';
  }
}
