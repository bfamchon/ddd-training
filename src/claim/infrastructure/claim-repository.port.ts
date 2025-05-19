import { Claim } from 'src/claim/domain/Claim';

export const I_CLAIM_REPOSITORY = 'I_CLAIM_REPOSITORY';

export interface ClaimRepository {
  save(claim: Claim): Promise<void>;
  findById(id: string): Promise<Claim | null>;
}
