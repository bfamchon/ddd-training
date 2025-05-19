import { IDomainEvent } from 'src/libs/shared-kernel/domain-events';
import { UniqueEntityID } from 'src/libs/shared-kernel/unique-entity-id';

export class CustomerClaimApproved implements IDomainEvent {
  public readonly eventName = 'CustomerClaimApproved';
  public readonly occurredOn: Date;
  public readonly claimId: string;
  public readonly customerId: string;
  public readonly billingId: string;

  constructor(claimId: string, customerId: string, billingId: string) {
    this.billingId = billingId;
    this.occurredOn = new Date();
    this.claimId = claimId;
    this.customerId = customerId;
  }

  get dateTimeOccurred(): Date {
    return this.occurredOn;
  }

  getAggregateId(): UniqueEntityID {
    return new UniqueEntityID(this.claimId);
  }
}
