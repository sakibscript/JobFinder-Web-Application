// src/interviews/interviews.module.ts
import { Module } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interview } from 'src/Entities/interview.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interview])],
  controllers: [InterviewController],
  providers: [InterviewService],
})
export class InterviewsModule {}
