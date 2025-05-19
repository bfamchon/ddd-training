export class ClaimNotFoundError extends Error {
  constructor(id: string) {
    super(`Claim with id ${id} not found`);
    this.name = 'ClaimNotFoundError';
  }
}
