import { IDomainEvent } from 'src/libs/shared-kernel/domain-events';
import { Entity } from 'src/libs/shared-kernel/entity';

export abstract class AggregateRoot<T> extends Entity<T> {
  private _domainEvents: IDomainEvent[] = [];

  get domainEvents(): IDomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(domainEvent: IDomainEvent): void {
    this._domainEvents.push(domainEvent);
    this.logDomainEventAdded(domainEvent);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }

  private logDomainEventAdded(domainEvent: IDomainEvent): void {
    console.info(`[Domain Event Created]: ${domainEvent.eventName}`);
  }
}
