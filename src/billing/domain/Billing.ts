import { BillingLine } from 'src/billing/domain/BillingLine';
import { AggregateRoot } from 'src/shared/aggregate-root';
import { UniqueEntityID } from 'src/shared/unique-entity-id';

type BillingProps = {
  id: UniqueEntityID;
  customerId: UniqueEntityID;
  billingLines: BillingLine[];
};

export class Billing extends AggregateRoot<BillingProps> {
  addBillingLine(billingLine: BillingLine) {
    this.props.billingLines.push(billingLine);
  }
}
