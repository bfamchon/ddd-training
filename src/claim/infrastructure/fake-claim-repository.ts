import { Claim } from 'src/claim/domain/Claim';
import { ClaimRepository } from 'src/claim/infrastructure/claim-repository.port';
import { DomainEventBus } from 'src/libs/shared-kernel/domain-event-bus';

export class FakeClaimRepository implements ClaimRepository {
  private claims: Claim[] = [];

  constructor(private eventBus: DomainEventBus) {
    this.claims = [];
  }
  async save(claim: Claim): Promise<void> {
    this.claims.push(claim);

    this.eventBus.publishAll(claim.domainEvents);
    claim.clearEvents();

    return Promise.resolve();
  }

  async findById(id: string): Promise<Claim | null> {
    return Promise.resolve(
      this.claims.find((claim) => claim.id.toString() === id) || null,
    );
  }
}
