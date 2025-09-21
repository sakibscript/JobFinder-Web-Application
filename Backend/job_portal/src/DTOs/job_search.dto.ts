import { IsOptional, IsString } from 'class-validator';

export class JobSearchDTO {
  @IsOptional()
  @IsString()
  title?: string;
}
