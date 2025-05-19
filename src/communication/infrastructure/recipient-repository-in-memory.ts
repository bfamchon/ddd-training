import { Recipient } from 'src/communication/domain/Recipient';
import { RecipientRepository } from 'src/communication/infrastructure/recipient-repository.port';

export class InMemoryRecipientRepository implements RecipientRepository {
  private readonly recipients: Recipient[] = [];

  async create(recipient: Recipient): Promise<void> {
    this.recipients.push(recipient);
    return Promise.resolve();
  }

  async findById(id: string): Promise<Recipient | null> {
    return Promise.resolve(
      this.recipients.find((recipient) => recipient.id.toString() === id) ||
        null,
    );
  }
}
