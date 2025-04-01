export class ParkingNotFoundError extends Error {
  constructor() {
    super('Parking not found');
  }
}
