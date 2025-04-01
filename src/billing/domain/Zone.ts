import { Hour } from 'src/billing/domain/Hour';
import { Price } from 'src/billing/domain/Price';
import { Entity } from 'src/shared/entity';
import { UniqueEntityID } from 'src/shared/unique-entity-id';

type ZoneProps = {
  id: UniqueEntityID;
  priceUntilHour: Hour;
  price: Price;
};

export class Zone extends Entity<ZoneProps> {
  private constructor(zone: ZoneProps) {
    super(zone);
  }

  public static create(zone: ZoneProps): Zone {
    return new Zone(zone);
  }
}
