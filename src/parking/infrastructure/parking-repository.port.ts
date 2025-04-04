import { Parking } from 'src/parking/domain/Parking';
import { UniqueEntityID } from 'src/shared/unique-entity-id';

export const PARKING_REPOSITORY = 'PARKING_REPOSITORY';
export interface ParkingRepository {
  save(parking: Parking): Promise<void>;
  findById(id: UniqueEntityID): Promise<Parking | null>;
}
