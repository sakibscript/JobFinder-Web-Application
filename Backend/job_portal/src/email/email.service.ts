import { Injectable } from '@nestjs/common';

import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sakibulalam557@gmail.com',
      pass: 'jgcw onis feve hcol',
    },
  });

  async sendVerificationCode(to: string, code: string) {
    const mailOptions = {
      from: 'Job Portal',
      to,
      subject: 'Email Verification Code',
      html: `<h3>Your verification code is: <strong>${code}</strong></h3>`
    };

    await this.transporter.sendMail(mailOptions);
  }


  async sendEmail( to: string, resetLink: string) {
    await this.transporter.sendMail({
      from: 'Job Portal',
      to,
      subject: 'Reset Your Password',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
    });
  }
}