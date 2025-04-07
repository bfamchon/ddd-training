import { Customer } from 'src/billing/domain/Customer';
import { UniqueEntityID } from 'src/shared/unique-entity-id';
export const CUSTOMER_REPOSITORY = 'CUSTOMER_REPOSITORY';

export interface CustomerRepository {
  findByIds(ids: UniqueEntityID[]): Promise<Customer[]>;
}
