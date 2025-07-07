import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class JobApplicationDTO {
  @IsNumber()
  applicationId: number;

  @IsNumber()
  @IsNotEmpty()
  jobId: number;

  @IsNumber()
  @IsNotEmpty()
  jobSeekerId: number;

  @IsOptional()
  @IsString()
  coverLetter?: string;

  @IsOptional()
  @IsString()
  employerAction?: string;

  @IsOptional()
  @IsDateString()
  followUpReminderDate?: string;

  @IsString()
  status: string;
}
