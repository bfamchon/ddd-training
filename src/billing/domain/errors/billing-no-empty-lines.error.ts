export class BillingNoEmptyLinesError extends Error {
  constructor() {
    super('Billing cannot have empty lines');
    this.name = 'BillingNoEmptyLinesError';
  }
}
