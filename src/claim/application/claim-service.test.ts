import { ClaimService } from 'src/claim/application/claim-service';
import { ClaimAlreadyEndedError } from 'src/claim/domain/errors/claim-already-ended.error';
import { ClaimRepository } from 'src/claim/infrastructure/claim-repository.port';
import { FakeClaimRepository } from 'src/claim/infrastructure/fake-claim-repository';
import { FakeDomainEventBus } from 'src/libs/shared-kernel/infrastructure/event-bus';
import {
  FakeIDGenerator,
  IDGenerator,
} from 'src/libs/shared-kernel/unique-entity-id';

describe('Claim service', () => {
  let service: ClaimService;
  let repository: ClaimRepository;
  let idGenerator: IDGenerator;
  let domainEventBus: FakeDomainEventBus;

  beforeEach(() => {
    domainEventBus = new FakeDomainEventBus();
    repository = new FakeClaimRepository(domainEventBus);
    idGenerator = new FakeIDGenerator();
    service = new ClaimService(repository, idGenerator);
  });
  describe('Feature : Customer send a claim request', () => {
    it('Should create a claim', async () => {
      const claim = await service.createClaim({
        customerId: 'customerId',
        billingId: 'billingId',
        message: 'Je veux un remboursement !!',
        amount: 100,
      });
      const createdClaim = await repository.findById(claim.id.toString());
      expect(createdClaim).toBeDefined();
      expect(createdClaim).toEqual(claim);
      expect(createdClaim?.status.value).toEqual('PENDING');
    });
  });
  describe('Feature : Customer care service approve a claim', () => {
    it('Should change claim status to approved', async () => {
      const claim = await service.createClaim({
        customerId: 'customerId',
        billingId: 'billingId',
        message: 'Je veux un remboursement !!',
        amount: 100,
      });
      await service.approveClaim(claim.id.toString());
      const updatedClaim = await repository.findById(claim.id.toString());
      expect(updatedClaim).toBeDefined();
      expect(updatedClaim?.status.value).toEqual('APPROVED');
    });
    it('Should throw ClaimNotFoundError if claim does not exist', async () => {
      await expect(
        service.approveClaim('non-existing-claim-id'),
      ).rejects.toThrow('Claim with id non-existing-claim-id not found');
    });
    it('Should throw ClaimAlreadyApprovedError if claim is already approved', async () => {
      const claim = await service.createClaim({
        customerId: 'customerId',
        billingId: 'billingId',
        message: 'Je veux un remboursement !!',
        amount: 100,
      });
      await service.approveClaim(claim.id.toString());
      await expect(service.approveClaim(claim.id.toString())).rejects.toThrow(
        ClaimAlreadyEndedError,
      );
    });
    it('Should send a CustomerClaimApproved event when claim is approved', async () => {
      const claim = await service.createClaim({
        customerId: 'customerId',
        billingId: 'billingId',
        message: 'Je veux un remboursement !!',
        amount: 100,
      });
      await service.approveClaim(claim.id.toString());
      const events = domainEventBus.events;
      expect(events).toHaveLength(1);
      expect(events[0].eventName).toEqual('CustomerClaimApproved');
      expect(events[0]).toMatchObject({
        claimId: claim.id.toString(),
        customerId: claim.props.customerId.toString(),
        billingId: claim.props.billingId.toString(),
        eventName: 'CustomerClaimApproved',
      });
    });
  });
});
