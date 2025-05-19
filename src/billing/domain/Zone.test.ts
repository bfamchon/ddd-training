import { EmptyZonePricingError } from 'src/billing/domain/errors/empty-zone-pricing.error';
import { Hour } from 'src/billing/domain/Hour';
import { Zone } from 'src/billing/domain/Zone';
import { ZonePricing } from 'src/billing/domain/ZonePricing';
import { Duration } from 'src/libs/shared-kernel/Duration';
import { Price } from 'src/libs/shared-kernel/Price';
import { UniqueEntityID } from 'src/libs/shared-kernel/unique-entity-id';

describe('Zone', () => {
  it('should calculate parking cost of 3 EUR', () => {
    // Arrange
    const zone = Zone.create({
      id: new UniqueEntityID(),
      zonePricing: [
        ZonePricing.create({
          priceUntilHour: Hour.create(1),
          price: Price.create({ currency: 'EUR', amount: 3 }),
        }),
      ],
    });

    const duration = Duration.fromMilliseconds(30 * 60 * 1000); // 30 minutes

    // Act
    const cost = zone.calculateParkingCost(duration);

    // Assert
    expect(cost).toEqual(Price.create({ amount: 3, currency: 'EUR' }));
  });

  it('should calculate parking cost of 18 EUR', () => {
    // Arrange
    const zone = Zone.create({
      id: new UniqueEntityID(),
      zonePricing: [
        ZonePricing.create({
          priceUntilHour: Hour.create(1),
          price: Price.create({ currency: 'EUR', amount: 3 }),
        }),
        ZonePricing.create({
          priceUntilHour: Hour.create(2),
          price: Price.create({ currency: 'EUR', amount: 3 }),
        }),
        ZonePricing.create({
          priceUntilHour: Hour.create(3),
          price: Price.create({ currency: 'EUR', amount: 6 }),
        }),
      ],
    });

    const duration = Duration.fromMilliseconds(
      2 * 60 * 60 * 1000 + 30 * 60 * 1000,
    ); // 2 hours and 30 minutes

    // Act
    const cost = zone.calculateParkingCost(duration);

    // Assert
    expect(cost).toEqual(Price.create({ amount: 18, currency: 'EUR' }));
  });

  it('should calculate parking cost of 30 EUR', () => {
    // Arrange
    const zone = Zone.create({
      id: new UniqueEntityID(),
      zonePricing: [
        ZonePricing.create({
          priceUntilHour: Hour.create(1),
          price: Price.create({ currency: 'EUR', amount: 3 }),
        }),
        ZonePricing.create({
          priceUntilHour: Hour.create(2),
          price: Price.create({ currency: 'EUR', amount: 3 }),
        }),
        ZonePricing.create({
          priceUntilHour: Hour.create(3),
          price: Price.create({ currency: 'EUR', amount: 6 }),
        }),
      ],
    });

    const duration = Duration.fromMilliseconds(
      5 * 60 * 60 * 1000 + 30 * 60 * 1000,
    ); // 5 hours and 30 minutes

    // Act
    const cost = zone.calculateParkingCost(duration);

    // Assert
    expect(cost).toEqual(Price.create({ amount: 36, currency: 'EUR' }));
  });

  it('should throw an error when no zone pricing is available', () => {
    // Arrange
    const zone = Zone.create({
      id: new UniqueEntityID(),
      zonePricing: [],
    });

    const duration = Duration.fromMilliseconds(30 * 60 * 1000); // 30 minutes

    // Act & Assert
    expect(() => zone.calculateParkingCost(duration)).toThrow(
      EmptyZonePricingError,
    );
  });
});
