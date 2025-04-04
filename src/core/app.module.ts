import { Module } from '@nestjs/common';
import { BillingModule } from '../billing/billing.module';
import { ParkingModule } from '../parking/parking.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ParkingModule, BillingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
