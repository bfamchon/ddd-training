import { Module } from '@nestjs/common';
import { ClaimModule } from 'src/claim/claim.module';

import { BillingModule } from 'src/billing/billing.module';
import { CommunicationModule } from 'src/communication/communication.module';
import { AppController } from 'src/core/app.controller';
import { ParkingModule } from 'src/parking/parking.module';
import { AppService } from './app.service';

@Module({
  imports: [ParkingModule, BillingModule, ClaimModule, CommunicationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
