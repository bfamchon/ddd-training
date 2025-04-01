export class ParkingAlreadyEndedError extends Error {
  constructor() {
    super('Parking already ended');
  }
}
