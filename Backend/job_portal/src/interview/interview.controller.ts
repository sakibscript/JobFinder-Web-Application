// src/interviews/interviews.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { InterviewsService } from './interview.service';
import { JwtAuthGuard } from 'src/Auth/jwt-auth.guard';

@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyInterviews(@Req() req) {
    const jobSeekerId = req.user.userId;
    return this.interviewsService.getInterviewsForJobSeeker(jobSeekerId);
  }
}
