import { BillingLine } from 'src/billing/domain/BillingLine';
import { Status } from 'src/billing/domain/Status';
import { BillingNoEmptyLinesError } from 'src/billing/domain/errors/billing-no-empty-lines.error';
import { Price } from 'src/libs/shared-kernel/Price';
import { AggregateRoot } from 'src/libs/shared-kernel/aggregate-root';
import { UniqueEntityID } from 'src/libs/shared-kernel/unique-entity-id';
import { BillingAmountCalculated } from 'src/libs/shared-kernel/v1/events/BillingAmountCalculated';

type BillingProps = {
  id: UniqueEntityID;
  customerId: UniqueEntityID;
  billingLines: BillingLine[];
  status: Status;
};

export class Billing extends AggregateRoot<BillingProps> {
  private constructor(billing: BillingProps) {
    super(billing);
  }
  addBillingLine(billingLine: BillingLine) {
    this.props.billingLines.push(billingLine);
  }

  calculateTotal(): Price {
    const total = this.props.billingLines.reduce(
      (total, billingLine) => {
        return total.add(billingLine.props.amount);
      },
      Price.create({ amount: 0, currency: 'EUR' }),
    );
    this.addDomainEvent(
      new BillingAmountCalculated({
        billingId: this.props.id.toString(),
        customerId: this.props.customerId.toString(),
        amount: total.amount,
      }),
    );
    return total;
  }

  abort() {
    if (this.props.status.canChangeTo('ABORTED')) {
      this.props.status = Status.create('ABORTED');
    }
  }

  public static create(billing: Omit<BillingProps, 'status'>): Billing {
    if (billing.billingLines.length === 0) {
      throw new BillingNoEmptyLinesError();
    }
    return new Billing({ ...billing, status: Status.create('PENDING') });
  }

  getBillingRange(): { start: Date; end: Date } {
    const startOfMonth = new Date(
      this.props.billingLines[0].date.getFullYear(),
      this.props.billingLines[0].date.getMonth(),
      1,
    );
    const endOfMonth = new Date(
      this.props.billingLines[0].date.getFullYear(),
      this.props.billingLines[0].date.getMonth() + 1,
      0,
    );
    return {
      start: startOfMonth,
      end: endOfMonth,
    };
  }
}
