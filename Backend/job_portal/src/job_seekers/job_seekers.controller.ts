import {
  Body,
  Controller,
  Get,
  Headers,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  Request,
  UseGuards,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../Auth/jwt-auth.guard';
import { JobSeekersService } from './job_seekers.service';
import { CreateJobSeekerDto } from '../DTOs/create_job_seeker.dto';
import { UpdateJobSeekerDto } from '../DTOs/update-job-seeker.dto';
import { EmailVerificationService } from 'src/email_verification/email_verification.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { UploadResumeDto } from '../DTOs/upload_resume.dto';
import { UploadImageDto } from 'src/DTOs/upload-image.dto';
import { diskStorage } from 'multer';
import { JobSeeker } from 'src/Entities/job_seeker.entity';
import { LoginDto } from '../DTOs/LoginDto.dto';
import { Role } from 'src/Auth/role.enum';
import { Roles } from 'src/Auth/roles.decorator';
import { Public } from 'src/Auth/public.decorator';
import {
  profileImageUploadConfig,
  resumeUploadConfig,
} from 'src/config/multer.config';

@Controller('job-seekers')
export class JobSeekersController {
  constructor(
    private readonly jobSeekerService: JobSeekersService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Public()
  @Post('send-code')
  async sendCode(@Body('email') email: string) {
    return this.emailVerificationService.sendCode(email);
  }

  @Public()
  @Post('register')
  async signup(@Body() dto: CreateJobSeekerDto, @Body('code') code: string) {
    return this.jobSeekerService.register(dto, code);
  }

  // @Public()
  // @Get(':id')
  // findById(@Param('id', ParseIntPipe) id: number) {
  //   return this.jobSeekerService.findById(id);
  // }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.JobSeeker)
  @Put(':id')
  update(@Param('id') id: number, @Body() updateUser: UpdateJobSeekerDto) {
    return this.jobSeekerService.update(id, updateUser);
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.jobSeekerService.login(loginDto);
  }
  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.emailVerificationService.requestPasswordReset(email);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.jobSeekerService.resetPassword(token, newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req) {
    return this.jobSeekerService.getJobSeekerProfile(req.user.userId);
  }

  // @UseGuards(JwtAuthGuard)
  // @Roles(Role.JobSeeker)
  // @Post('upload-resume/:seekerId')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './uploads/resumes',
  //       filename: (req, file, cb) => {
  //         const uniqueName = `${Date.now()}-${file.originalname}`;
  //         cb(null, uniqueName);
  //       },
  //     }),
  //   }),
  // )
  // async uploadResume(
  //   @Param('seekerId', ParseIntPipe) seekerId: number,
  //   @UploadedFile() file: Express.Multer.File,
  // ): Promise<JobSeeker> {
  //   const uploadDto = new UploadResumeDto();
  //   uploadDto.seekerId = seekerId;
  //   uploadDto.resume = file.filename;

  //   return this.jobSeekerService.uploadResume(uploadDto);
  // }
  @UseGuards(JwtAuthGuard)
  @Roles(Role.JobSeeker)
  @Post('upload-resume/:seekerId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/resumes',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async uploadResume(
    @Param('seekerId', ParseIntPipe) seekerId: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ filename: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const uploadDto = new UploadResumeDto();
    uploadDto.seekerId = seekerId;
    uploadDto.resume = file.filename;

    await this.jobSeekerService.uploadResume(uploadDto);
    return { filename: file.filename }; // ✅ return filename only
  }

  // @UseGuards(JwtAuthGuard)
  // @Roles(Role.JobSeeker)
  // @Post('upload-image/:seekerId')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './uploads/profile-images',
  //       filename: (req, file, cb) => {
  //         const uniqueName = `${Date.now()}-${file.originalname}`;
  //         cb(null, uniqueName);
  //       },
  //     }),
  //     fileFilter: (req, file, cb) => {
  //       if (!file.mimetype.startsWith('image/')) {
  //         return cb(
  //           new BadRequestException('Only image files are allowed!'),
  //           false,
  //         );
  //       }
  //       cb(null, true);
  //     },
  //   }),
  // )
  // async uploadImage(
  //   @Param('seekerId', ParseIntPipe) seekerId: number,
  //   @UploadedFile() file: Express.Multer.File,
  // ): Promise<JobSeeker> {
  //   const uploadDto = new UploadImageDto();
  //   uploadDto.seekerId = seekerId;
  //   uploadDto.imageUrl = file.filename;

  //   return this.jobSeekerService.uploadImage(uploadDto);
  // }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.JobSeeker)
  @Post('upload-image/:seekerId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profile-images',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadImage(
    @Param('seekerId', ParseIntPipe) seekerId: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ filename: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const uploadDto = new UploadImageDto();
    uploadDto.seekerId = seekerId;
    uploadDto.imageUrl = file.filename;

    await this.jobSeekerService.uploadImage(uploadDto);
    return { filename: file.filename }; // ✅ return filename only
  }

  // @UseGuards(JwtAuthGuard)
  // @Roles(Role.JobSeeker)
  // @Post('me/resume')
  // @UseInterceptors(FileInterceptor('file', resumeUploadConfig))
  // async uploadResume(@Req() req, @UploadedFile() file: Express.Multer.File) {
  //   if (!file) {
  //     throw new BadRequestException('No file uploaded');
  //   }
  //   return this.jobSeekerService.updateResume(req.user.sub, file.filename);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Roles(Role.JobSeeker)
  // @Post('me/profile-image')
  // @UseInterceptors(FileInterceptor('file', profileImageUploadConfig))
  // async uploadProfileImage(
  //   @Req() req,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   if (!file) {
  //     throw new BadRequestException('No file uploaded');
  //   }
  //   return this.jobSeekerService.updateProfileImage(
  //     req.user.sub,
  //     file.filename,
  //   );
  // }
}
