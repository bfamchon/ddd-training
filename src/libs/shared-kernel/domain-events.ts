import { UniqueEntityID } from 'src/libs/shared-kernel/unique-entity-id';

export interface IDomainEvent {
  eventName: string;
  occurredOn: Date;
  getAggregateId(): UniqueEntityID;
}

export abstract class DomainEvent<TPayload> implements IDomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName: string;

  constructor(public readonly payload: TPayload) {
    this.occurredOn = new Date();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    this.eventName = (this.constructor as any).eventName;
  }

  abstract getAggregateId(): UniqueEntityID;
}
