import { Price } from 'src/billing/domain/Price';
import { Zone } from 'src/billing/domain/Zone';
import { Entity } from 'src/shared/entity';
import { UniqueEntityID } from 'src/shared/unique-entity-id';

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

  public static create(billingLine: BillingLineProps): BillingLine {
    return new BillingLine(billingLine);
  }
}
