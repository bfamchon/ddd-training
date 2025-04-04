export class ZoneNotFoundError extends Error {
  constructor(zone: string) {
    super();
    this.message = `Zone ${zone} not found`;
    this.name = 'ZoneNotFoundError';
  }
}
