import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JobApplicationsService } from './job_applications.service';
import { JobApplicationDTO } from 'src/DTOs/job_application.dto';
import { JobApplication } from 'src/Entities/job_application.entity';
import { Roles } from 'src/Auth/roles.decorator';
import { Role } from 'src/Auth/role.enum';
import { JwtAuthGuard } from 'src/Auth/jwt-auth.guard';
import { AddMessageDto } from 'src/DTOs/add-message.dto';

@Controller('job-applications')
export class JobApplicationsController {
  constructor(
    private readonly jobApplicationsService: JobApplicationsService,
  ) {}

  // Apply to a job
  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.JobSeeker)
  async applyToJob(
    @Body() applyJobDto: JobApplicationDTO,
  ): Promise<JobApplication> {
    const { jobId, jobSeekerId, coverLetter } = applyJobDto;
    return this.jobApplicationsService.applyToJob(applyJobDto);
  }

  // Application History

  // @Get(':seekerId')
  // async getApplicationsBySeeker(
  //   @Param('seekerId', ParseIntPipe) seekerId: number,
  // ): Promise<JobApplication[]> {
  //   return this.jobApplicationsService.getApplicationsBySeeker(seekerId);
  // }
  // @Roles(Role.JobSeeker, Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Get('recent/me')
  getRecentApplications(@Req() req) {
    return this.jobApplicationsService.getRecentApplicationsByJobSeeker(
      req.user.userId,
    );
  }

  // @Get('recent/:jobSeekerId')
  // async getRecentApplications(@Param('jobSeekerId') jobSeekerId: number) {
  //   return this.jobApplicationsService.getRecentApplicationsByJobSeeker(
  //     jobSeekerId,
  //   );
  // }

  //Track the applied job
  @Roles(Role.Admin)
  @Patch('tracking/:jobApplicationId')
  async applicationTracking(
    @Param('jobApplicationId', ParseIntPipe) jobApplicationId: number,
    @Body() updateDto: JobApplicationDTO,
  ): Promise<JobApplication> {
    return this.jobApplicationsService.applicationTracking(
      jobApplicationId,
      updateDto,
    );
  }

  @Patch(':id/messages')
  addMessage(@Param('id') id: number, @Body() dto: AddMessageDto) {
    return this.jobApplicationsService.addMessage(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('messages/recent/me')
  getRecentMessages(@Req() req) {
    return this.jobApplicationsService.getRecentMessages(req.user.userId);
  }
}
