import { Zone } from 'src/billing/domain/Zone';
import { BillingZoneRepository } from 'src/billing/infrastructure/billing-zone-repository.port';
import { UniqueEntityID } from 'src/shared/unique-entity-id';

export class BillingZoneRepositoryInMemory implements BillingZoneRepository {
  zones: Zone[];
  constructor() {
    this.zones = [];
  }
  findById(id: UniqueEntityID): Promise<Zone | null> {
    const zone = this.zones.find((zone) => zone.props.id.equals(id));
    return Promise.resolve(zone || null);
  }

  create(zone: Zone): Promise<void> {
    this.zones.push(zone);
    return Promise.resolve();
  }
}
