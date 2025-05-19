import { Hour } from 'src/billing/domain/Hour';
import { Zone } from 'src/billing/domain/Zone';
import { ZonePricing } from 'src/billing/domain/ZonePricing';
import { Price } from 'src/libs/shared-kernel/Price';
import { UniqueEntityID } from 'src/libs/shared-kernel/unique-entity-id';

export const testZone = {
  zone1: Zone.create({
    id: new UniqueEntityID('zoneId'),
    zonePricing: [
      ZonePricing.create({
        price: Price.create({
          amount: 10,
          currency: 'EUR',
        }),
        priceUntilHour: Hour.create(2),
      }),
    ],
  }),
};
