import { BillingService } from 'src/billing/application/billing.service';
import { Hour } from 'src/billing/domain/Hour';
import { Price } from 'src/billing/domain/Price';
import { Zone } from 'src/billing/domain/Zone';
import { ZonePricing } from 'src/billing/domain/ZonePricing';
import { BillingRepositoryInMemory } from 'src/billing/infrastructure/billing-repository.in-memory';
import { BillingRepository } from 'src/billing/infrastructure/billing-repository.port';
import { BillingZoneRepositoryInMemory } from 'src/billing/infrastructure/billing-zone-repository.in-memory';
import { BillingZoneRepository } from 'src/billing/infrastructure/billing-zone-repository.port';
import { UniqueEntityID } from 'src/shared/unique-entity-id';

describe('Feature : User leave parking', () => {
  let service: BillingService;
  let zoneRepository: BillingZoneRepository;
  let billingRepository: BillingRepository;

  beforeEach(() => {
    zoneRepository = new BillingZoneRepositoryInMemory();
    billingRepository = new BillingRepositoryInMemory();
    service = new BillingService(zoneRepository, billingRepository);
  });

  it('Should add a billing line when user leave parking', async () => {
    const zone = Zone.create({
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
    });
    await zoneRepository.create(zone);

    await service.addBillingLine({
      driverId: 'driverId',
      zoneId: 'zoneId',
      sessionDuration: 1000 * 60 * 60 * 2, // 2 hours
    });
    const billing = await billingRepository.findByCustomerId(
      new UniqueEntityID('driverId'),
    );
    expect(billing).not.toBeNull();
    expect(billing?.calculateTotal()).toEqual(
      Price.create({
        amount: 20,
        currency: 'EUR',
      }),
    );
  });
});
