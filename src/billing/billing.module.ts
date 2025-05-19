import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  BillingService,
  I_BILLING_SERVICE,
} from 'src/billing/application/billing-service';
import {
  DRIVER_END_PARKING_HANDLER,
  DriverEndParkingHandler,
} from 'src/billing/application/driver-end-parking.handler';
import { BillingRepositoryInMemory } from 'src/billing/infrastructure/billing-repository.in-memory';
import { BILLING_REPOSITORY } from 'src/billing/infrastructure/billing-repository.port';
import { BillingZoneRepositoryInMemory } from 'src/billing/infrastructure/billing-zone-repository.in-memory';
import { BILLING_ZONE_REPOSITORY } from 'src/billing/infrastructure/billing-zone-repository.port';
import {
  CRON_SERVICE,
  CronService,
} from 'src/billing/infrastructure/cron.service';
import { EmailServiceFake } from 'src/billing/infrastructure/email-service.fake';
import { EMAIL_SERVICE } from 'src/billing/infrastructure/email-service.port';

@Module({
  imports: [CqrsModule],
  providers: [
    {
      provide: CRON_SERVICE,
      inject: [I_BILLING_SERVICE],
      useFactory: (billingService) => new CronService(billingService),
    },
    {
      provide: DRIVER_END_PARKING_HANDLER,
      inject: [I_BILLING_SERVICE],
      useFactory: (billingService) =>
        new DriverEndParkingHandler(billingService),
    },
    {
      provide: I_BILLING_SERVICE,
      inject: [BILLING_ZONE_REPOSITORY, BILLING_REPOSITORY, EMAIL_SERVICE],
      useFactory: (billingZoneRepository, billingRepository) =>
        new BillingService(billingZoneRepository, billingRepository),
    },
    {
      provide: BILLING_ZONE_REPOSITORY,
      useClass: BillingZoneRepositoryInMemory,
    },
    {
      provide: BILLING_REPOSITORY,
      useClass: BillingRepositoryInMemory,
    },
    {
      provide: EMAIL_SERVICE,
      useClass: EmailServiceFake,
    },
  ],
})
export class BillingModule {}
