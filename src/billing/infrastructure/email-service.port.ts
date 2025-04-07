export const EMAIL_SERVICE = 'EMAIL_SERVICE';

export interface EmailService {
  sendEmail({
    to,
    subject,
    body,
  }: {
    to: string;
    subject: string;
    body: string;
  }): Promise<void>;
}
