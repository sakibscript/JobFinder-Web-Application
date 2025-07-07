import { Module } from '@nestjs/common';
import { JobSeekersController } from './job_seekers.controller';
import { JobSeekersService } from './job_seekers.service';
import { JobSeeker } from '../Entities/job_seeker.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerificationModule } from 'src/email_verification/email_verification.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/Auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobSeeker]),
    EmailVerificationModule,
    AuthModule,
  ],
  controllers: [JobSeekersController],
  providers: [JobSeekersService],
})
export class JobSeekersModule {}
