import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
//email service
@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendEmail(
    toEmail: string,
    firstName: string,
    password: string,
    // role: string,
  ): Promise<void> {
    const loginUrl = 'http://localhost:5173/login';
    const subject = `Your Account Has Been Created`;

    const text = `
Hello ${firstName}, 

Welcome aboard! Your account has been successfully created in the Attendance System.

You can now log in and start using your account via the link below:
${loginUrl}

Your Login Details are: 
Email: ${toEmail}
Password: ${password}

If you have any questions or need assistance, feel free to reach out to the admin team.

Best regards,  
The Attendance System Team
  `.trim();

    const mailOptions = {
      from: this.configService.get<string>('MAIL_USER'),
      to: toEmail,
      subject,
      text,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
