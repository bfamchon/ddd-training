import { Claim } from 'src/claim/domain/Claim';
import { ClaimNotFoundError } from 'src/claim/domain/errors/claim-not-found.error';
import { ClaimRepository } from 'src/claim/infrastructure/claim-repository.port';
import { Price } from 'src/libs/shared-kernel/Price';
import {
  IDGenerator,
  UniqueEntityID,
} from 'src/libs/shared-kernel/unique-entity-id';

export type CreateClaimDto = {
  customerId: string;
  billingId: string;
  message: string;
  amount: number;
};

export type RejectClaimDto = {
  claimId: string;
  message: string;
};

export class ClaimService {
  constructor(
    private readonly claimRepository: ClaimRepository,
    private readonly idGenerator: IDGenerator,
  ) {}

  async createClaim(createClaimDto: CreateClaimDto): Promise<Claim> {
    const claim = Claim.create({
      customerId: new UniqueEntityID(createClaimDto.customerId),
      billingId: new UniqueEntityID(createClaimDto.billingId),
      message: createClaimDto.message,
      amount: Price.create({
        amount: createClaimDto.amount,
        currency: 'EUR',
      }),
      id: this.idGenerator.generate(),
    });
    await this.claimRepository.save(claim);
    return claim;
  }

  async approveClaim(claimId: string): Promise<void> {
    const claim = await this.claimRepository.findById(claimId);
    if (!claim) {
      throw new ClaimNotFoundError(claimId);
    }
    claim.approve();
    await this.claimRepository.save(claim);
  }

  async rejectClaim({ claimId, message }: RejectClaimDto): Promise<void> {
    const claim = await this.claimRepository.findById(claimId);
    if (!claim) {
      throw new ClaimNotFoundError(claimId);
    }
    claim.reject(message);
    await this.claimRepository.save(claim);
  }
}
