import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CommunicationService } from 'src/communication/application/communication-service';
import { BillingAmountCalculated } from 'src/libs/shared-kernel/v1/events/BillingAmountCalculated';

export const BILLING_CALCULATED_HANDLER = 'BILLING_CALCULATED_HANDLER';

@EventsHandler(BillingAmountCalculated)
export class BillingCalculatedHandler
  implements IEventHandler<BillingAmountCalculated>
{
  constructor(private readonly communicationService: CommunicationService) {}

  async handle(event: BillingAmountCalculated): Promise<void> {
    console.log(
      `[Communication] Handling BillingAmountCalculated event for customer ${event.payload.customerId}`,
    );
    const { billingId, customerId, amount } = event.payload;
    await this.communicationService.handleBillingCalculated({
      billingId,
      customerId,
      amount,
    });
  }
}
