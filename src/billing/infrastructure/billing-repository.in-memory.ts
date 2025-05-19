import { Billing } from 'src/billing/domain/Billing';
import { BillingRepository } from 'src/billing/infrastructure/billing-repository.port';
import { UniqueEntityID } from 'src/libs/shared-kernel/unique-entity-id';
import { BillingRange } from './billing-repository.port';

export class BillingRepositoryInMemory implements BillingRepository {
  billings: Billing[];
  constructor() {
    this.billings = [];
  }
  findByCustomerId(
    id: UniqueEntityID,
    range: BillingRange,
  ): Promise<Billing | null> {
    const billing = this.billings.find(
      (billing) =>
        billing.props.billingLines[0].props.date >= range.start &&
        billing.props.billingLines[0].props.date <= range.end &&
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
  findById(id: UniqueEntityID): Promise<Billing | null> {
    const billing = this.billings.find((billing) =>
      billing.props.id.equals(id),
    );
    return Promise.resolve(billing || null);
  }
  save(billing: Billing): Promise<void> {
    const index = this.billings.findIndex((b) =>
      b.props.id.equals(billing.props.id),
    );
    if (index !== -1) {
      this.billings[index] = billing;
    }
    return Promise.resolve();
  }
}
