import { IDomainEvent } from 'src/shared/domain-events';
import { Entity } from 'src/shared/entity';

export abstract class AggregateRoot<T> extends Entity<T> {
  private _domainEvents: IDomainEvent[] = [];

  get domainEvents(): IDomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(domainEvent: IDomainEvent): void {
    this.logDomainEventAdded(domainEvent);
  }

  public clearEvents(): void {}

  private logDomainEventAdded(domainEvent: IDomainEvent): void {
    console.info(`[Domain Event Created]`);
  }
}
