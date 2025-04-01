import { Parking } from 'src/parking/domain/Parking';
import { UniqueEntityID } from 'src/shared/unique-entity-id';
export class ParkingRepositoryInMemory {
  parkings: Parking[];
  constructor() {
    this.parkings = [];
  }
  async save(parking) {
    this.parkings.push(parking);
  }

  async findById(id: UniqueEntityID) {
    return this.parkings.find((parking) => parking.props.id.equals(id)) || null;
  }
}
