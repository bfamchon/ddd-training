import { Zone } from 'src/billing/domain/Zone';
import { UniqueEntityID } from 'src/shared/unique-entity-id';

export const BILLING_ZONE_REPOSITORY = 'BILLING_ZONE_REPOSITORY';

export interface BillingZoneRepository {
  findById(id: UniqueEntityID): Promise<Zone | null>;
  create(zone: Zone): Promise<void>;
}
