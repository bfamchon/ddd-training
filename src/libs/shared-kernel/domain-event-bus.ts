import { IDomainEvent } from 'src/libs/shared-kernel/domain-events';

export const I_DOMAIN_EVENT_BUS = 'I_DOMAIN_EVENT_BUS';

export interface DomainEventBus {
  publish(event: IDomainEvent): void;
  publishAll(events: IDomainEvent[]): void;
}
