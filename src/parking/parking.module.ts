import { Module } from '@nestjs/common';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import {
  DomainEventBus,
  I_DOMAIN_EVENT_BUS,
} from 'src/libs/shared-kernel/domain-event-bus';
import { RealDomainEventBus } from 'src/libs/shared-kernel/infrastructure/event-bus';
import { PARKING_REPOSITORY } from 'src/parking/infrastructure/parking-repository.port';
import { DriverParkEndUseCase } from './application/driver-leave.use-case';
import { DriverParkUseCase } from './application/driver-park-start.use-case';
import { ParkingRepositoryInMemory } from './infrastructure/parking-repository.in-memory';
import { ParkingZoneRepositoryInMemory } from './infrastructure/parking-zone-repository.in-memory';

@Module({
  imports: [CqrsModule],
  providers: [
    DriverParkUseCase,
    DriverParkEndUseCase,
    {
      provide: PARKING_REPOSITORY,
      inject: [I_DOMAIN_EVENT_BUS],
      useFactory: (eventBus: DomainEventBus) =>
        new ParkingRepositoryInMemory(eventBus),
    },
    {
      provide: I_DOMAIN_EVENT_BUS,
      inject: [EventBus],
      useFactory: (eventBus: EventBus) => new RealDomainEventBus(eventBus),
    },
    {
      provide: 'ParkingZoneRepository',
      useClass: ParkingZoneRepositoryInMemory,
    },
  ],
  exports: [DriverParkUseCase, DriverParkEndUseCase],
})
export class ParkingModule {}
