import { Billing } from 'src/billing/domain/Billing';
import { UniqueEntityID } from 'src/shared/unique-entity-id';

export const BILLING_REPOSITORY = 'BILLING_REPOSITORY';

export interface BillingRepository {
  findByCustomerId(id: UniqueEntityID): Promise<Billing | null>;
  create(billing: Billing): Promise<void>;
  findAllBetween({
    start,
    end,
  }: {
    start: Date;
    end: Date;
  }): Promise<Billing[]>;
}
