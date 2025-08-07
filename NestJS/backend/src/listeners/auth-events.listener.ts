import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from '../services/emailService';

@Injectable()
export class AuthEventsListener {
  constructor(private readonly emailService: EmailService) {}

  private readonly logger = new Logger(AuthEventsListener.name);

  @OnEvent('user.signedUp')
  async handleUserSignedUp(payload: {
    email: string;
    firstName: string;
    password: string;
  }) {
    await this.emailService.sendEmail(
      payload.email,
      payload.firstName,
      payload.password,
    );
    this.logger.log(`Welcome email sent to ${payload.email}`);
  }

  @OnEvent('user.loggedIn')
  handleUserLoggedIn(payload: { email: string }) {
    this.logger.log(`User logged in: ${payload.email}`);
  }
}
