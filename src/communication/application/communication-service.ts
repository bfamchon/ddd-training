import { Email } from 'src/communication/domain/Email';
import { RecipientNotFoundError } from 'src/communication/domain/errors/recipient-not-found.error';
import { Mailer } from 'src/communication/infrastructure/mailer.port';
import { RecipientRepository } from 'src/communication/infrastructure/recipient-repository.port';

export class CommunicationService {
  constructor(
    private readonly recipientRepository: RecipientRepository,
    private readonly mailer: Mailer,
  ) {}

  async handleClaimRejected({
    claimId,
    customerId,
    message,
  }: {
    claimId: string;
    customerId: string;
    message: string;
  }): Promise<void> {
    const recipient = await this.recipientRepository.findById(customerId);
    if (!recipient) {
      throw new RecipientNotFoundError(customerId);
    }
    await this.mailer.sendEmail(
      Email.create({
        to: recipient.email,
        subject: `Claim ${claimId} rejected`,
        body: `Your claim with ID ${claimId} has been rejected. Reason: ${message}`,
      }),
    );
  }

  async handleBillingCalculated({
    customerId,
    billingId,
    amount,
  }: {
    customerId: string;
    billingId: string;
    amount: number;
  }): Promise<void> {
    const recipient = await this.recipientRepository.findById(customerId);
    if (!recipient) {
      throw new RecipientNotFoundError(customerId);
    }
    await this.mailer.sendEmail(
      Email.create({
        to: recipient.email,
        subject: `Your monthly billing is ready`,
        body: `Your billing with ID ${billingId} has been calculated. Amount: ${amount}`,
      }),
    );
  }
}
