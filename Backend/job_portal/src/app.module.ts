import { Module } from '@nestjs/common';
import { JobSeekersModule } from './job_seekers/job_seekers.module';
import { JobSeeker } from './Entities/job_seeker.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerificationModule } from './email_verification/email_verification.module';
import { EmailModule } from './email/email.module';
import { Job } from './Entities/job.entity';
import { JobModule } from './job/job.module';
import { JobApplicationsModule } from './job_applications/job_applications.module';
import { JobApplication } from './Entities/job_application.entity';
import { PaymentModule } from './payment/payment.module';
import { Payment } from './Entities/payment.entity';
import { Subscription } from './Entities/subscription.entity';
import { AuthModule } from './Auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { InterviewsModule } from './interview/interview.module';
import { Interview } from './Entities/interview.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './Auth/roles.guard';
import { JwtAuthGuard } from './Auth/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes config available everywhere
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '12345',
      database: 'Job_Portal',
      entities: [
        JobSeeker,
        Job,
        JobApplication,
        Payment,
        Subscription,
        Interview,
      ],
      synchronize: true,
    }),
    JobSeekersModule,
    EmailModule,
    EmailVerificationModule,
    JobModule,
    JobApplicationsModule,
    JobApplicationsModule,
    PaymentModule,
    AuthModule,
    InterviewsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
