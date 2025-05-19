import { Billing } from 'src/billing/domain/Billing';
import { UniqueEntityID } from 'src/libs/shared-kernel/unique-entity-id';

export const BILLING_REPOSITORY = 'BILLING_REPOSITORY';

export type BillingRange = {
  start: Date;
  end: Date;
};

export interface BillingRepository {
  findByCustomerId(
    id: UniqueEntityID,
    range: BillingRange,
  ): Promise<Billing | null>;
  create(billing: Billing): Promise<void>;
  findAllBetween({
    start,
    end,
  }: {
    start: Date;
    end: Date;
  }): Promise<Billing[]>;
  findById(id: UniqueEntityID): Promise<Billing | null>;
  save(billing: Billing): Promise<void>;
}
