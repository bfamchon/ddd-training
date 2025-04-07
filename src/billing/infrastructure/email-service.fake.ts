import { EmailService } from 'src/billing/infrastructure/email-service.port';

export class EmailServiceFake implements EmailService {
  public emails: {
    to: string;
    subject: string;
    body: string;
  }[] = [];
  async sendEmail({
    to,
    subject,
    body,
  }: {
    to: string;
    subject: string;
    body: string;
  }): Promise<void> {
    this.emails.push({ to, subject, body });
    return Promise.resolve();
  }
}
