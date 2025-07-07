// src/interviews/interviews.module.ts
import { Module } from '@nestjs/common';
import { InterviewsService } from './interview.service';
import { InterviewsController } from './interview.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interview } from 'src/Entities/interview.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interview])],
  controllers: [InterviewsController],
  providers: [InterviewsService],
})
export class InterviewsModule {}
