export class ClaimAlreadyEndedError extends Error {
  constructor(id: string) {
    super(`Claim with id ${id} is already ended`);
    this.name = 'ClaimAlreadyEndedError';
  }
}
