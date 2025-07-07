import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JobService } from './job.service';
import { JobSearchDTO } from 'src/DTOs/job_search.dto';
import { Job } from 'src/Entities/job.entity';
import { SaveJobDto } from 'src/DTOs/job_save.dto';
import { Roles } from 'src/Auth/roles.decorator';
import { Role } from 'src/Auth/role.enum';
import { Public } from 'src/Auth/public.decorator';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  // @Public()
  // @Get('search')
  // async searchJobs(@Query() searchDto: JobSearchDTO): Promise<Job[]> {
  //   return this.jobService.searchJobs(searchDto);
  // }

  @Public()
  @Get()
  async getAllJobs(): Promise<Job[]> {
    return this.jobService.getAllJobs();
  }
  @Public()
  @Get('count')
  async getJobCount(): Promise<{ count: number }> {
    return this.jobService.getJobCount();
  }

  @Public()
  @Get('category/:category')
  async getJobsByCategory(@Param('category') category: string): Promise<Job[]> {
    return this.jobService.getJobsByCategory(category);
  }

  @Public()
  @Get('categories')
  async getCategories(): Promise<string[]> {
    return this.jobService.getCategories();
  }

  @Public()
  @Get('popular-categories')
  async getPopularCategories(): Promise<{ category: string; count: number }[]> {
    return this.jobService.getPopularCategories();
  }

  @Public()
  @Get('popular-companies')
  async getPopularCompanies(): Promise<{ company: string; count: number }[]> {
    return this.jobService.getPopularCompanies();
  }

  @Public()
  @Get('search')
  async searchJobs(
    @Query('title') title: string,
    @Query('page') page = 1,
    @Query('limit') limit = 6,
  ) {
    return this.jobService.searchJobsByTitle(title, +page, +limit);
  }

  // @Post('save-job')
  // async saveJob(@Body() saveJobDto: SaveJobDto): Promise<Job> {
  //   return this.jobService.saveJob(saveJobDto);
  // }

  // @Get(':seekerId')
  // async getSavedJobs(
  //   @Param('seekerId', ParseIntPipe) seekerId: number,
  // ): Promise<Job[]> {
  //   return this.jobService.getSavedJobsBySeeker(seekerId);
  // }

  // @Delete(':savedJobId')
  // async deleteSavedJob(
  //   @Param('savedJobId', ParseIntPipe) savedJobId: number,
  // ): Promise<string> {
  //   return this.jobService.deleteSavedJob(savedJobId);
  // }
}
