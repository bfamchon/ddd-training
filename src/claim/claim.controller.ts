import { Body, Controller, Post } from '@nestjs/common';
import { ClaimService } from 'src/claim/application/claim-service';
import { CreateClaimRequest, CreateClaimSchema } from 'src/claim/contracts';
import { ZodValidationPipe } from 'src/core/pipes/zod-validation.pipe';

@Controller()
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @Post('/claims')
  async handleCreateClaim(
    @Body(new ZodValidationPipe(CreateClaimSchema))
    body: CreateClaimRequest,
  ) {
    const createClaimDto = {
      customerId: body.customerId,
      billingId: body.billingId,
      message: body.message,
      amount: body.amount,
    };
    const claim = await this.claimService.createClaim(createClaimDto);
    return claim;
  }
}
