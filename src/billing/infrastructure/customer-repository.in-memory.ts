import { Customer } from 'src/billing/domain/Customer';
import { CustomerRepository } from 'src/billing/infrastructure/customer-repository.port';
import { UniqueEntityID } from 'src/shared/unique-entity-id';

export class CustomerRepositoryInMemory implements CustomerRepository {
  private customers: Customer[] = [];

  public async findByIds(ids: UniqueEntityID[]): Promise<Customer[]> {
    const customers = this.customers.filter((customer) =>
      ids.some((id) => id.equals(customer.props.id)),
    );
    return Promise.resolve(customers);
  }
}
