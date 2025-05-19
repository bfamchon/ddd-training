import { Zone } from 'src/billing/domain/Zone';
import { Entity } from 'src/libs/shared-kernel/entity';
import { Price } from 'src/libs/shared-kernel/Price';
import { UniqueEntityID } from 'src/libs/shared-kernel/unique-entity-id';

type BillingLineProps = {
  id: UniqueEntityID;
  date: Date;
  amount: Price;
  zone: Zone;
};

export class BillingLine extends Entity<BillingLineProps> {
  private constructor(billingLine: BillingLineProps) {
    super(billingLine);
  }

  get id(): UniqueEntityID {
    return this.props.id;
  }
  get date(): Date {
    return this.props.date;
  }
  get amount(): Price {
    return this.props.amount;
  }
  get zone(): Zone {
    return this.props.zone;
  }

  public static create(billingLine: BillingLineProps): BillingLine {
    return new BillingLine(billingLine);
  }
}
