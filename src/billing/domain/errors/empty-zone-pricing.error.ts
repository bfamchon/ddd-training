export class EmptyZonePricingError extends Error {
  constructor() {
    super();
    this.message = 'No zone pricing available';
    this.name = 'ZonePricingError';
  }
}
