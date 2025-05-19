import { DomainEvent } from 'src/libs/shared-kernel/domain-events';
import { UniqueEntityID } from 'src/libs/shared-kernel/unique-entity-id';

type BillingAmountCalculatedProps = {
  customerId: string;
  billingId: string;
  amount: number;
};

export class BillingAmountCalculated extends DomainEvent<BillingAmountCalculatedProps> {
  public readonly eventName = 'BillingAmountCalculated';

  getAggregateId(): UniqueEntityID {
    return new UniqueEntityID(this.payload.billingId);
  }
}
