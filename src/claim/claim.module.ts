import { Module } from '@nestjs/common';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { ClaimService } from 'src/claim/application/claim-service';
import { ClaimController } from 'src/claim/claim.controller';
import {
  ClaimRepository,
  I_CLAIM_REPOSITORY,
} from 'src/claim/infrastructure/claim-repository.port';
import { FakeClaimRepository } from 'src/claim/infrastructure/fake-claim-repository';
import {
  DomainEventBus,
  I_DOMAIN_EVENT_BUS,
} from 'src/libs/shared-kernel/domain-event-bus';
import { RealDomainEventBus } from 'src/libs/shared-kernel/infrastructure/event-bus';
import { IDGenerator } from 'src/libs/shared-kernel/unique-entity-id';

@Module({
  imports: [CqrsModule],
  controllers: [ClaimController],
  providers: [
    {
      provide: ClaimService,
      inject: [I_CLAIM_REPOSITORY],
      useFactory: (
        claimRepository: ClaimRepository,
        idGenerator: IDGenerator,
      ) => new ClaimService(claimRepository, idGenerator),
    },
    {
      provide: I_DOMAIN_EVENT_BUS,
      inject: [EventBus],
      useFactory: (eventBus: EventBus) => new RealDomainEventBus(eventBus),
    },
    {
      provide: I_CLAIM_REPOSITORY,
      inject: [I_DOMAIN_EVENT_BUS],
      useFactory: (eventBus: DomainEventBus) =>
        new FakeClaimRepository(eventBus),
    },
  ],
  exports: [],
})
export class ClaimModule {}
