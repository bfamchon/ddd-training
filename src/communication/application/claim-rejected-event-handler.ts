import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CommunicationService } from 'src/communication/application/communication-service';
import { CustomerClaimRejected } from 'src/libs/shared-kernel/v1/events/CustomerClaimRejected';

export const CLAIM_REJECTED_HANDLER = 'CLAIM_REJECTED_HANDLER';

@EventsHandler(CustomerClaimRejected)
export class ClaimRejectedHandler
  implements IEventHandler<CustomerClaimRejected>
{
  constructor(private readonly communicationService: CommunicationService) {}

  async handle(event: CustomerClaimRejected): Promise<void> {
    console.log(
      `[Communication] Handling CustomerClaimRejected event for claim ${event.claimId}`,
    );
    const { claimId, customerId, message } = event;
    await this.communicationService.handleClaimRejected({
      claimId,
      customerId,
      message,
    });
  }
}
