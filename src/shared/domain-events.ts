import { UniqueEntityID } from 'src/shared/unique-entity-id';

export interface IDomainEvent {
  eventName: string;
  occurredOn: Date;
  getAggregateId(): UniqueEntityID;
}
