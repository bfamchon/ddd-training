export class RecipientNotFoundError extends Error {
  constructor(recipientId: string) {
    super(`Recipient with ID ${recipientId} not found.`);
    this.name = 'RecipientNotFoundError';
  }
}
