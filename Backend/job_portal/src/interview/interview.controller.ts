// src/interviews/interviews.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { JwtAuthGuard } from 'src/Auth/jwt-auth.guard';

@Controller('interviews')
export class InterviewController {
  constructor(private readonly interviewsService: InterviewService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyInterviews(@Req() req) {
    const jobSeekerId = req.user.userId;
    return this.interviewsService.getInterviewsForJobSeeker(jobSeekerId);
  }
}
