import { Recipient } from 'src/communication/domain/Recipient';

export interface RecipientRepository {
  findById(id: string): Promise<Recipient | null>;
  create(recipient: Recipient): Promise<void>;
}
