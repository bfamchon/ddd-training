import { DomainEventBus } from 'src/libs/shared-kernel/domain-event-bus';
import { IDomainEvent } from 'src/libs/shared-kernel/domain-events';

export class FakeDomainEventBus implements DomainEventBus {
  public events: IDomainEvent[] = [];

  publish(event: IDomainEvent) {
    this.events.push(event);
  }

  publishAll(events: IDomainEvent[]) {
    this.events.push(...events);
  }
}
