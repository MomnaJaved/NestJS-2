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
  ): Promise<void> {
    const loginUrl = 'http://localhost:5173/login';
    const subject = `Your Account Has Been Created`;

    const html = `
  <div style="max-width: 600px; margin: 0 auto; padding: 30px; background-color: #f9f9f9; font-family: Arial, sans-serif; color: #333; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: center;">
    
    <h2 style="color: #2E86C1; margin-bottom: 20px;">Welcome, ${firstName}!</h2>

    <p style="font-size: 16px; color: #1e577c; margin-bottom: 15px;">
      Your account has been successfully created in the <strong>Attendance System</strong>.
    </p>

    <p style="font-size: 16px; color: #1e577c; margin-bottom: 25px;">
      You can now log in and start using your account via the button below:
    </p>

    <a href="${loginUrl}" style="display: inline-block; background-color: #2E86C1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; margin-bottom: 25px;">
      Login to Attendance System
    </a>

    <div style="text-align: left; margin-top: 30px;">
      <h4 style="color: #1e577c;">Your Login Details:</h4>
      <ul style="list-style: none; padding-left: 0; font-size: 12px; color: #333;">
        <li><strong>Email:</strong> ${toEmail}</li>
        <li><strong>Password:</strong> ${password}</li>
      </ul>
    </div>

    <p style="font-size: 13px; color: #666; margin-top: 20px;">
      <em>For your security, please update your password after logging in.</em>
      <br>
     <em> If you have any questions or need help, feel free to contact the admin team. </em>
    </p>

    <p style="font-size: 15px; color: #1e577c; margin-top: 40px;">
      Best regards,<br/>
      <span style="color: #122c3eff;"><em>The Attendance System Team</em></span>
    </p>
  </div>
`;

    const mailOptions = {
      from: this.configService.get<string>('MAIL_USER'),
      to: toEmail,
      subject,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
