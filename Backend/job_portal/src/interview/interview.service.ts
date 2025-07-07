// src/interviews/interviews.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview } from 'src/Entities/interview.entity';

@Injectable()
export class InterviewsService {
  constructor(
    @InjectRepository(Interview)
    private interviewRepo: Repository<Interview>,
  ) {}

  async getInterviewsForJobSeeker(jobSeekerId: number) {
    return this.interviewRepo.find({
      where: { jobSeeker: { jobSeekerId: jobSeekerId } },
      order: { date: 'ASC' },
    });
  }

  async create(interviewData: Partial<Interview>) {
    const interview = this.interviewRepo.create(interviewData);
    return this.interviewRepo.save(interview);
  }
}
