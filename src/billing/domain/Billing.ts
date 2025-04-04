import { BillingLine } from 'src/billing/domain/BillingLine';
import { Price } from 'src/billing/domain/Price';
import { AggregateRoot } from 'src/shared/aggregate-root';
import { UniqueEntityID } from 'src/shared/unique-entity-id';

type BillingProps = {
  id: UniqueEntityID;
  customerId: UniqueEntityID;
  billingLines: BillingLine[];
};

export class Billing extends AggregateRoot<BillingProps> {
  private constructor(billing: BillingProps) {
    super(billing);
  }
  addBillingLine(billingLine: BillingLine) {
    this.props.billingLines.push(billingLine);
  }

  calculateTotal(): Price {
    const total = this.props.billingLines.reduce((total, billingLine) => {
      return total + billingLine.props.amount.amount;
    }, 0);
    return Price.create({ amount: total, currency: 'EUR' });
  }

  public static create(billing: BillingProps): Billing {
    return new Billing(billing);
  }
}
