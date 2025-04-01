import { Identifier } from 'src/shared/identifier';

export class UniqueEntityID extends Identifier<string | number> {
  constructor(id?: string | number) {
    super(id ? id : crypto.randomUUID());
  }
}

export interface IDGenerator {
  generate(): UniqueEntityID;
}

export class RealIDGenerator implements IDGenerator {
  generate(): UniqueEntityID {
    return new UniqueEntityID();
  }
}

export class FakeIDGenerator implements IDGenerator {
  generate(): UniqueEntityID {
    return new UniqueEntityID('fake-id');
  }
}
