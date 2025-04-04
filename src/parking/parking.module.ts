import { Module } from '@nestjs/common';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
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
      inject: [EventBus],
      useFactory: (eventBus) => new ParkingRepositoryInMemory(eventBus),
    },
    {
      provide: 'ParkingZoneRepository',
      useClass: ParkingZoneRepositoryInMemory,
    },
  ],
  exports: [DriverParkUseCase, DriverParkEndUseCase],
})
export class ParkingModule {}
