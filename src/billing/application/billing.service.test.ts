import { BillingService } from 'src/billing/application/billing-service';
import { BillingRepositoryInMemory } from 'src/billing/infrastructure/billing-repository.in-memory';
import { BillingRepository } from 'src/billing/infrastructure/billing-repository.port';
import { BillingZoneRepositoryInMemory } from 'src/billing/infrastructure/billing-zone-repository.in-memory';
import { BillingZoneRepository } from 'src/billing/infrastructure/billing-zone-repository.port';
import { testZone } from 'src/billing/tests/zone.seeds';
import { Price } from 'src/libs/shared-kernel/Price';
import { UniqueEntityID } from 'src/libs/shared-kernel/unique-entity-id';

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
    await zoneRepository.create(testZone.zone1);

    await service.addBillingLine({
      driverId: 'driverId',
      zoneId: testZone.zone1.props.id.toString(),
      sessionDuration: 1000 * 60 * 60 * 2, // 2 hours
    });
    const billing = await billingRepository.findByCustomerId(
      new UniqueEntityID('driverId'),
      {
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      },
    );
    expect(billing).not.toBeNull();
    expect(billing?.calculateTotal()).toEqual(
      Price.create({
        amount: 20,
        currency: 'EUR',
      }),
    );
  });

  it('Should send billing to customer at the end of the month', async () => {
    await zoneRepository.create(testZone.zone1);

    await service.addBillingLine({
      driverId: 'driverId',
      zoneId: 'zoneId',
      sessionDuration: 1000 * 60 * 60 * 2, // 2 hours
    });
    const billing = await billingRepository.findByCustomerId(
      new UniqueEntityID('driverId'),
      {
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      },
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
