import { PartialType } from '@nestjs/mapped-types';
import { CreateJobSeekerDto } from './create_job_seeker.dto';

export class UpdateJobSeekerDto extends PartialType(CreateJobSeekerDto) {}
