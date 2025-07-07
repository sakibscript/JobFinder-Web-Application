import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerificationService } from './email_verification.service';
import { JobSeeker } from 'src/Entities/job_seeker.entity';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobSeeker]), EmailModule],
  providers: [EmailVerificationService, EmailService],
  exports: [EmailVerificationService]
})
export class EmailVerificationModule {}
