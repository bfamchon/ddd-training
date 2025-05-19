import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BillingService } from 'src/billing/application/billing-service';
import { CustomerClaimApproved } from 'src/libs/shared-kernel/v1/events/CustomerClaimApproved';
export const CUSTOMER_CLAIM_APPROVED_HANDLER =
  'CUSTOMER_CLAIM_APPROVED_HANDLER';

@EventsHandler(CustomerClaimApproved)
export class CustomerClaimRejectedHandler
  implements IEventHandler<CustomerClaimApproved>
{
  constructor(private readonly billingService: BillingService) {}

  async handle(event: CustomerClaimApproved): Promise<void> {
    console.log(
      `[Billing] Handling CustomerClaimApproved event for claim ${event.claimId}`,
    );
    const { billingId } = event;
    await this.billingService.abortBilling({
      billingId,
    });
  }
}
