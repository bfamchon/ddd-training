import { Email } from 'src/communication/domain/Email';
import { Mailer } from 'src/communication/infrastructure/mailer.port';

export class InMemoryMailer implements Mailer {
  public readonly sentEmails: Email[] = [];

  async sendEmail(email: Email): Promise<void> {
    this.sentEmails.push(email);
    return Promise.resolve();
  }
}
