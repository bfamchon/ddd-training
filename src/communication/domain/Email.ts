import { EmailAddress } from 'src/communication/domain/EmailAddress';
import { ValueObject } from 'src/libs/shared-kernel/value-object';

export type EmailProps = {
  to: EmailAddress;
  subject: string;
  body: string;
};

export class Email extends ValueObject<EmailProps> {
  private constructor(props: EmailProps) {
    super(props);
  }

  public static create(props: EmailProps): Email {
    return new Email(props);
  }

  get to(): EmailAddress {
    return this.props.to;
  }

  get subject(): string {
    return this.props.subject;
  }

  get body(): string {
    return this.props.body;
  }
}
