import { EventBus } from '@nestjs/cqrs';
import { DomainEventBus } from 'src/libs/shared-kernel/domain-event-bus';
import { IDomainEvent } from 'src/libs/shared-kernel/domain-events';

export class RealDomainEventBus implements DomainEventBus {
  constructor(private readonly eventBus: EventBus) {}

  publish(event: IDomainEvent) {
    this.eventBus.publish(event);
  }
  publishAll(events: IDomainEvent[]) {
    this.eventBus.publishAll(events);
  }
}
