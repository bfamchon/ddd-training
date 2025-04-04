export class ParkingNotEndedError extends Error {
  constructor() {
    super('Parking not ended');
  }
}
