import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { JobSeeker } from 'src/Entities/job_seeker.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class EmailVerificationService {
  private readonly verificationCodes = new Map<string, { code: string, expiry: number }>();
  constructor(
    private readonly emailService: EmailService,

    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepo: Repository<JobSeeker>
  ) {}

  async sendCode(email: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 5 * 60 * 1000;
    this.verificationCodes.set(email, { code, expiry });

    await this.emailService.sendVerificationCode(email, code);
    return { message: 'Verification code sent' };
  }

  async verifyCode(email: string, code: string) {
    const record = this.verificationCodes.get(email);

    if (!record) {
      throw new BadRequestException('No verification code sent to this email');
    }

    if (record.expiry < Date.now()) {
      this.verificationCodes.delete(email);
      throw new BadRequestException('Verification code expired');
    }

    if (record.code !== code) {
      throw new BadRequestException('Invalid verification code');
    }

    this.verificationCodes.delete(email);
    return { message: 'Email successfully verified' };
  }

  async requestPasswordReset(email: string) {
    const user = await this.jobSeekerRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 10);

    await this.jobSeekerRepo.save(user);
    const resetLink = `http://jobportal.com/reset-password?token=${resetToken}`;

    await this.emailService.sendEmail(email, resetLink);
    return { message: 'Reset link sent to your email' };
  }
}
