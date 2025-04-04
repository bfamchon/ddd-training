import { Billing } from 'src/billing/domain/Billing';
import { BillingLine } from 'src/billing/domain/BillingLine';
import { ZoneNotFoundError } from 'src/billing/domain/errors/zone-not-found.error';
import { BillingRepository } from 'src/billing/infrastructure/billing-repository.port';
import { BillingZoneRepository } from 'src/billing/infrastructure/billing-zone-repository.port';
import { Duration } from 'src/shared/Duration';
import { UniqueEntityID } from 'src/shared/unique-entity-id';

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
    let billing = await this.billingRepository.findByCustomerId(
      new UniqueEntityID(driverId),
    );
    if (!billing) {
      billing = Billing.create({
        id: new UniqueEntityID(),
        customerId: new UniqueEntityID(driverId),
        billingLines: [],
      });
    }
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
    billing.addBillingLine(billingLine);
    // then persist billing
    await this.billingRepository.create(billing);
  }
}
