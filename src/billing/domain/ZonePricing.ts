import { Hour } from 'src/billing/domain/Hour';
import { Price } from 'src/billing/domain/Price';
import { ValueObject } from 'src/shared/value-object';

type ZonePricingProps = {
  priceUntilHour: Hour;
  price: Price;
};

export class ZonePricing extends ValueObject<ZonePricingProps> {
  private constructor(zonePricing: ZonePricingProps) {
    super(zonePricing);
  }

  isApplicable(totalHours: number): boolean {
    return this.props.priceUntilHour.value >= totalHours;
  }

  public static create(zonePricing: ZonePricingProps): ZonePricing {
    return new ZonePricing(zonePricing);
  }
}
