import { ClaimAlreadyEndedError } from 'src/claim/domain/errors/claim-already-ended.error';
import { Status } from 'src/claim/domain/Status';
import { AggregateRoot } from 'src/libs/shared-kernel/aggregate-root';
import { Price } from 'src/libs/shared-kernel/Price';
import { UniqueEntityID } from 'src/libs/shared-kernel/unique-entity-id';
import { CustomerClaimApproved } from 'src/libs/shared-kernel/v1/events/CustomerClaimApproved';
import { CustomerClaimRejected } from 'src/libs/shared-kernel/v1/events/CustomerClaimRejected';

type ClaimProps = {
  id: UniqueEntityID;
  customerId: UniqueEntityID;
  amount: Price;
  status: Status;
  billingId: UniqueEntityID;
  message: string;
};

export class Claim extends AggregateRoot<ClaimProps> {
  private constructor(props: ClaimProps) {
    super(props);
  }

  static create({
    id,
    customerId,
    billingId,
    message,
    amount,
  }: Omit<ClaimProps, 'status'>): Claim {
    return new Claim({
      id,
      customerId,
      billingId,
      message,
      amount,
      status: Status.create('PENDING'),
    });
  }

  approve(): void {
    if (!this.status.canChangeTo('APPROVED')) {
      throw new ClaimAlreadyEndedError(this.id.toString());
    }
    this.changeStatusTo(Status.create('APPROVED'));
    this.addDomainEvent(
      new CustomerClaimApproved(
        this.props.id.toString(),
        this.props.customerId.toString(),
        this.props.billingId.toString(),
      ),
    );
  }

  reject(message: string): void {
    if (!this.status.canChangeTo('REJECTED')) {
      throw new ClaimAlreadyEndedError(this.id.toString());
    }
    this.changeStatusTo(Status.create('REJECTED'));
    this.addDomainEvent(
      new CustomerClaimRejected(
        this.props.id.toString(),
        this.props.customerId.toString(),
        this.props.billingId.toString(),
        message,
      ),
    );
  }

  changeStatusTo(newStatus: Status): void {
    if (!this.status.canChangeTo(newStatus.value)) {
      return;
    }
    this.props.status = newStatus;
  }

  get id(): UniqueEntityID {
    return this.props.id;
  }

  get customerId(): UniqueEntityID {
    return this.props.customerId;
  }
  get billingId(): UniqueEntityID {
    return this.props.billingId;
  }
  get message(): string {
    return this.props.message;
  }
  get amount(): Price {
    return this.props.amount;
  }
  get status(): Status {
    return this.props.status;
  }
}
