import { ValueObject } from 'src/libs/shared-kernel/value-object';

type EmailAddressProps = {
  value: string;
};

export class EmailAddress extends ValueObject<EmailAddressProps> {
  private constructor(email: EmailAddressProps) {
    super(email);
  }

  public static create(email: EmailAddressProps): EmailAddress {
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email address');
    }
    return new EmailAddress(email);
  }

  private static isValidEmail(email: EmailAddressProps): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.value);
  }

  public get value(): string {
    return this.props.value;
  }
}
