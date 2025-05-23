import { ValueObject } from 'src/libs/shared-kernel/value-object';

type PriceProps = {
  amount: number;
  currency: string;
};

export class Price extends ValueObject<PriceProps> {
  private constructor(props: PriceProps) {
    super(props);
  }

  get amount(): number {
    return this.props.amount;
  }

  get currency(): string {
    return this.props.currency;
  }

  public static create(price: PriceProps): Price {
    const { amount, currency } = price;
    if (amount < 0) {
      throw new Error('Price amount cannot be negative');
    }
    if (!currency || currency.trim().length !== 3) {
      throw new Error('Invalid currency code');
    }
    return new Price(price);
  }

  add(price: Price): Price {
    if (this.currency !== price.currency) {
      throw new Error('Cannot add prices with different currencies');
    }
    return Price.create({
      amount: this.amount + price.amount,
      currency: this.currency,
    });
  }
}
