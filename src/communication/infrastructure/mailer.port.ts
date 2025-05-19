import { Email } from 'src/communication/domain/Email';

export const I_MAILER = 'I_MAILER';

export interface Mailer {
  sendEmail(email: Email): Promise<void>;
}
