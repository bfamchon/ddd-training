import { EmailAddress } from 'src/communication/domain/EmailAddress';
import { AggregateRoot } from 'src/libs/shared-kernel/aggregate-root';
import { UniqueEntityID } from 'src/libs/shared-kernel/unique-entity-id';

type RecipientProps = {
  name: string;
  email: EmailAddress;
  id: UniqueEntityID;
};

export class Recipient extends AggregateRoot<RecipientProps> {
  private constructor(recipient: RecipientProps) {
    super(recipient);
  }

  public static create(recipient: RecipientProps): Recipient {
    return new Recipient(recipient);
  }

  public get id(): UniqueEntityID {
    return this.props.id;
  }

  public get name(): string {
    return this.props.name;
  }

  public get email(): EmailAddress {
    return this.props.email;
  }
}
