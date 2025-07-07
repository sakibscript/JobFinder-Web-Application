// import { IsString, IsOptional, IsNumber } from 'class-validator';

// export class JobSearchDTO {
//   @IsOptional()
//   @IsString()
//   searchText?: string;
// }

// export class JobSearchDTO {
//   title?: string;
//   location?: string;
//   category?: string;
//   company?: string;
//   minSalary?: number;
//   maxSalary?: number;
// }

import { IsOptional, IsString } from 'class-validator';

export class JobSearchDTO {
  @IsOptional()
  @IsString()
  title?: string;
}
