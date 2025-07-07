import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JobSeeker } from '../Entities/job_seeker.entity';
import { CreateJobSeekerDto } from '../DTOs/create_job_seeker.dto';
import { UpdateJobSeekerDto } from '../DTOs/update-job-seeker.dto';
import { EmailVerificationService } from 'src/email_verification/email_verification.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import { UploadResumeDto } from '../DTOs/upload_resume.dto';
import { Express } from 'express';
import { LoginDto } from '../DTOs/LoginDto.dto';
import { UploadImageDto } from 'src/DTOs/upload-image.dto';
import { Role } from 'src/Auth/role.enum';

@Injectable()
export class JobSeekersService {
  constructor(
    @InjectRepository(JobSeeker)
    private jobSeekerRepo: Repository<JobSeeker>,
    private readonly verificationService: EmailVerificationService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateJobSeekerDto, code: string) {
    const verificationResult = await this.verificationService.verifyCode(
      dto.email,
      code,
    );
    const existingUser = await this.jobSeekerRepo.findOne({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new UnauthorizedException('Email is already registered.');
    }
    if (verificationResult) {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const user = this.jobSeekerRepo.create({
        ...dto,
        password: hashedPassword,
      });
      return this.jobSeekerRepo.save(user);
    }
    throw new BadRequestException('Email verification failed');
  }

  // async findById(id: number) {
  //   const user = await this.jobSeekerRepo.findOne({
  //     where: { jobSeekerId: id },
  //   });
  //   if (!user) throw new NotFoundException('User not found');
  //   return user;
  // }

  async findById(id: number): Promise<JobSeeker> {
    const jobSeeker = await this.jobSeekerRepo.findOne({
      where: { jobSeekerId: id },
    });

    if (!jobSeeker) {
      throw new NotFoundException(`Job seeker with ID ${id} not found`);
    }

    return jobSeeker;
  }

  async findByEmail(email: string) {
    return this.jobSeekerRepo.findOne({ where: { email } });
  }

  async update(id: number, dto: UpdateJobSeekerDto) {
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    await this.jobSeekerRepo.update(id, dto);
    return this.findById(id);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.jobSeekerRepo.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.jobSeekerId,
      email: user.email,
      role: Role.JobSeeker,
    };
    const accessToken = this.jwtService.sign(payload);
    // await this.jobSeekerRepo.update(user.jobSeekerId, { accessToken });

    return {
      message: 'Login successful',
      accessToken,
      user: {
        userId: user.jobSeekerId,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        image: user.imageUrl,
      },
    };
  }

  // async login(loginDto: LoginDto) {
  //   const { email, password } = loginDto;
  //   const user = await this.jobSeekerRepo.findOne({ where: { email } });

  //   if (!user) {
  //     throw new UnauthorizedException('Invalid email or password');
  //   }

  //   const isPasswordValid = await bcrypt.compare(password, user.password);
  //   if (!isPasswordValid) {
  //     throw new UnauthorizedException('Invalid email or password');
  //   }

  //   const sessionToken = Date.now().toString();
  //   await this.jobSeekerRepo.update(user.jobSeekerId, { sessionToken });

  //   return {
  //     message: 'Login successful',
  //     user: {
  //       userId: user.jobSeekerId,
  //       fullName: user.fullName,
  //       email: user.email,
  //       phone: user.phone,
  //       role: user.role,
  //     },
  //     sessionToken: sessionToken,
  //     expiresIn: 100,
  //   };
  // }

  // async findBySessionToken(token: string): Promise<JobSeeker | null> {
  //   return this.jobSeekerRepo.findOne({ where: { sessionToken: token } });
  // }
  async getJobSeekerProfile(jobSeekerId: number) {
    const jobSeeker = await this.jobSeekerRepo.findOne({
      where: { jobSeekerId },
      relations: ['subscription'],
    });

    if (!jobSeeker) {
      throw new NotFoundException(
        `Job seeker with ID ${jobSeekerId} not found`,
      );
    }

    return {
      jobSeekerId: jobSeeker.jobSeekerId,
      fullName: jobSeeker.fullName,
      email: jobSeeker.email,
      phone: jobSeeker.phone,
      resumeUrl: jobSeeker.resumeUrl,
      imageUrl: jobSeeker.imageUrl,
      role: jobSeeker.role,
      isPremium: jobSeeker.subscription?.isPremium ?? false,
      expiresAt: jobSeeker.subscription?.expiresAt ?? null,
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.jobSeekerRepo.findOne({
      where: { resetToken: token },
    });

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Token is invalid or expired');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;

    return this.jobSeekerRepo.save(user);
  }

  async uploadResume(dto: UploadResumeDto): Promise<JobSeeker> {
    const { seekerId, resume } = dto;
    const jobSeeker = await this.jobSeekerRepo.findOne({
      where: { jobSeekerId: dto.seekerId },
    });
    if (!jobSeeker) {
      throw new NotFoundException('Job seeker not found');
    }

    jobSeeker.resumeUrl = resume;
    return this.jobSeekerRepo.save(jobSeeker);
  }

  async uploadImage(uploadDto: UploadImageDto): Promise<JobSeeker> {
    const seeker = await this.jobSeekerRepo.findOneBy({
      jobSeekerId: uploadDto.seekerId,
    });
    if (!seeker) throw new NotFoundException('Job seeker not found');

    seeker.imageUrl = uploadDto.imageUrl;
    return this.jobSeekerRepo.save(seeker);
  }

  // async updateResume(
  //   jobSeekerId: number,
  //   resumePath: string,
  // ): Promise<JobSeeker> {
  //   const jobSeeker = await this.findById(jobSeekerId);
  //   jobSeeker.resumeUrl = `/uploads/resumes/${resumePath}`;
  //   return this.jobSeekerRepo.save(jobSeeker);
  // }

  // async updateProfileImage(
  //   jobSeekerId: number,
  //   imagePath: string,
  // ): Promise<JobSeeker> {
  //   const jobSeeker = await this.findById(jobSeekerId);
  //   jobSeeker.imageUrl = `/uploads/profile-images/${imagePath}`;
  //   return this.jobSeekerRepo.save(jobSeeker);
  // }
}
