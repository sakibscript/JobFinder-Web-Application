import { IsNotEmpty, IsNumber } from 'class-validator';

export class SaveJobDto {
  @IsNotEmpty()
  @IsNumber()
  jobSeekerId: number;

  @IsNotEmpty()
  @IsNumber()
  jobId: number;
}
