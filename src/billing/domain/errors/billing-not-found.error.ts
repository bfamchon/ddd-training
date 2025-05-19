export class BillingNotFoundError extends Error {
  constructor(billingId: string) {
    super(`Billing with id ${billingId} not found`);
    this.name = 'BillingNotFoundError';
  }
}
