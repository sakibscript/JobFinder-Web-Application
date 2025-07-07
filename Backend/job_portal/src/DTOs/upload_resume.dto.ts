import { IsNotEmpty, IsNumber } from 'class-validator';

export class UploadResumeDto {
  @IsNotEmpty()
  @IsNumber()
  seekerId: number;
  resume: string;
}
