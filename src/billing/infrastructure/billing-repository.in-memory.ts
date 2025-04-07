import { Billing } from 'src/billing/domain/Billing';
import { BillingRepository } from 'src/billing/infrastructure/billing-repository.port';
import { UniqueEntityID } from 'src/shared/unique-entity-id';

export class BillingRepositoryInMemory implements BillingRepository {
  billings: Billing[];
  constructor() {
    this.billings = [];
  }
  findByCustomerId(id: UniqueEntityID): Promise<Billing | null> {
    const billing = this.billings.find((billing) =>
      billing.props.customerId.equals(id),
    );
    return Promise.resolve(billing || null);
  }
  create(billing: Billing): Promise<void> {
    this.billings.push(billing);
    return Promise.resolve();
  }
  findAllBetween({
    start,
    end,
  }: {
    start: Date;
    end: Date;
  }): Promise<Billing[]> {
    const billings = this.billings.filter(
      (billing) =>
        billing.props.billingLines[0].props.date >= start &&
        billing.props.billingLines[0].props.date <= end,
    );
    return Promise.resolve(billings);
  }
}
