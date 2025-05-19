import { Entity } from 'src/libs/shared-kernel/entity';
import { UniqueEntityID } from 'src/libs/shared-kernel/unique-entity-id';

type CustomerProps = {
  id: UniqueEntityID;
  name: string;
  email: string;
};

export class Customer extends Entity<CustomerProps> {
  private constructor(customer: CustomerProps) {
    super(customer);
  }

  public static create(customer: CustomerProps): Customer {
    return new Customer(customer);
  }
}
