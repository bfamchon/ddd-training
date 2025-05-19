import { EmptyZonePricingError } from 'src/billing/domain/errors/empty-zone-pricing.error';
import { ZonePricing } from 'src/billing/domain/ZonePricing';
import { Duration } from 'src/libs/shared-kernel/Duration';
import { Entity } from 'src/libs/shared-kernel/entity';
import { Price } from 'src/libs/shared-kernel/Price';
import { UniqueEntityID } from 'src/libs/shared-kernel/unique-entity-id';

type ZoneProps = {
  id: UniqueEntityID;
  zonePricing: ZonePricing[];
};

export class Zone extends Entity<ZoneProps> {
  private constructor(zone: ZoneProps) {
    super(zone);
  }

  calculateParkingCost(duration: Duration): Price {
    if (this.props.zonePricing.length === 0) {
      throw new EmptyZonePricingError();
    }
    const totalHours = Math.ceil(duration.toHours());

    const sortedZonePricing = this.props.zonePricing.toSorted(
      (a, b) => a.props.priceUntilHour.value - b.props.priceUntilHour.value,
    );

    const applicablePricing = sortedZonePricing.find((pricing) =>
      pricing.isApplicable(totalHours),
    );

    if (applicablePricing) {
      return Price.create({
        currency: 'EUR',
        amount: applicablePricing.props.price.amount * totalHours,
      });
    }
    const lastPricing = sortedZonePricing[sortedZonePricing.length - 1];
    return Price.create({
      currency: 'EUR',
      amount: lastPricing.props.price.amount * totalHours,
    });
  }

  public static create(zone: ZoneProps): Zone {
    return new Zone(zone);
  }
}
