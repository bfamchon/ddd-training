import { BillingService } from 'src/billing/application/billing.service';
import { Hour } from 'src/billing/domain/Hour';
import { Price } from 'src/billing/domain/Price';
import { Zone } from 'src/billing/domain/Zone';
import { ZonePricing } from 'src/billing/domain/ZonePricing';
import { BillingRepositoryInMemory } from 'src/billing/infrastructure/billing-repository.in-memory';
import { BillingRepository } from 'src/billing/infrastructure/billing-repository.port';
import { BillingZoneRepositoryInMemory } from 'src/billing/infrastructure/billing-zone-repository.in-memory';
import { BillingZoneRepository } from 'src/billing/infrastructure/billing-zone-repository.port';
import { CustomerRepositoryInMemory } from 'src/billing/infrastructure/customer-repository.in-memory';
import { CustomerRepository } from 'src/billing/infrastructure/customer-repository.port';
import { EmailServiceFake } from 'src/billing/infrastructure/email-service.fake';
import { UniqueEntityID } from 'src/shared/unique-entity-id';

describe('Feature : User leave parking', () => {
  let service: BillingService;
  let zoneRepository: BillingZoneRepository;
  let billingRepository: BillingRepository;
  let customerRepository: CustomerRepository;
  let emailService: EmailServiceFake;

  beforeEach(() => {
    zoneRepository = new BillingZoneRepositoryInMemory();
    billingRepository = new BillingRepositoryInMemory();
    customerRepository = new CustomerRepositoryInMemory();
    emailService = new EmailServiceFake();
    service = new BillingService(
      zoneRepository,
      billingRepository,
      customerRepository,
      emailService,
    );
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
  it('should send an email to user when billing is processed', async () => {
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
    await service.processMonthlyBilling();
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
    const email = emailService.emails[0];
    expect(email).toEqual({
      to: 'driverId',
      subject: 'Your monthly billing',
      body: `Your monthly billing is ${billing?.calculateTotal().amount} ${billing?.calculateTotal().currency}`,
    });
  });
});
