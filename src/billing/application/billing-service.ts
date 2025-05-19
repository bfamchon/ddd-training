import { Billing } from 'src/billing/domain/Billing';
import { BillingLine } from 'src/billing/domain/BillingLine';
import { BillingNotFoundError } from 'src/billing/domain/errors/billing-not-found.error';
import { ZoneNotFoundError } from 'src/billing/domain/errors/zone-not-found.error';
import { BillingRepository } from 'src/billing/infrastructure/billing-repository.port';
import { BillingZoneRepository } from 'src/billing/infrastructure/billing-zone-repository.port';
import { Duration } from 'src/libs/shared-kernel/Duration';
import { UniqueEntityID } from 'src/libs/shared-kernel/unique-entity-id';

export const I_BILLING_SERVICE = 'I_BILLING_SERVICE';

export class BillingService {
  constructor(
    private readonly billingZoneRepository: BillingZoneRepository,
    private readonly billingRepository: BillingRepository,
  ) {}

  async addBillingLine({
    driverId,
    zoneId,
    sessionDuration,
  }: {
    driverId: string;
    zoneId: string;
    sessionDuration: number;
  }) {
    const zone = await this.billingZoneRepository.findById(
      new UniqueEntityID(zoneId),
    );
    if (!zone) {
      throw new ZoneNotFoundError(zoneId);
    }
    const parkingCost = zone.calculateParkingCost(
      Duration.fromMilliseconds(sessionDuration),
    );

    const billingLine = BillingLine.create({
      id: new UniqueEntityID(),
      date: new Date(),
      amount: parkingCost,
      zone: zone,
    });

    const billing = await this.billingRepository.findByCustomerId(
      new UniqueEntityID(driverId),
      {
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      },
    );

    if (billing) {
      billing.addBillingLine(billingLine);
      return this.billingRepository.save(billing);
    }

    return this.billingRepository.create(
      Billing.create({
        id: new UniqueEntityID(),
        customerId: new UniqueEntityID(driverId),
        billingLines: [billingLine],
      }),
    );
  }

  async processMonthlyBilling() {
    const billings = await this.billingRepository.findAllBetween(
      Billing.getBillingRange(),
    );
    billings.forEach((billing) => {
      const total = billing.calculateTotal();
      console.log(
        `Billing for customer ${billing.props.customerId.toString()}: ${total.amount} ${total.currency}`,
      );
    });
  }

  async abortBilling({ billingId }: { billingId: string }) {
    const billing = await this.billingRepository.findById(
      new UniqueEntityID(billingId),
    );
    if (!billing) {
      throw new BillingNotFoundError(billingId);
    }
    billing.abort();
    await this.billingRepository.save(billing);
  }
}
