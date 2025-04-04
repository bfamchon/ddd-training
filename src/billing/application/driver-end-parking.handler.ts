import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BillingService } from 'src/billing/application/billing.service';
import { DriverEndParking } from 'src/parking/domain/events/DriverEndParking';
export const DRIVER_END_PARKING_HANDLER = 'DRIVER_END_PARKING_HANDLER';
@EventsHandler(DriverEndParking)
export class DriverEndParkingHandler
  implements IEventHandler<DriverEndParking>
{
  constructor(private readonly billingService: BillingService) {}

  async handle(event: DriverEndParking): Promise<void> {
    console.log(
      `[Billing] Handling DriverEndParking event for parking ${event.parkingId}`,
    );
    const { driverId, zoneId, sessionDuration } = event;
    await this.billingService.addBillingLine({
      driverId,
      zoneId,
      sessionDuration,
    });
  }
}
