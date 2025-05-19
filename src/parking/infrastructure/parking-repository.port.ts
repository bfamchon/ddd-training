import { UniqueEntityID } from 'src/libs/shared-kernel/unique-entity-id';
import { Parking } from 'src/parking/domain/Parking';

export const PARKING_REPOSITORY = 'PARKING_REPOSITORY';
export interface ParkingRepository {
  save(parking: Parking): Promise<void>;
  findById(id: UniqueEntityID): Promise<Parking | null>;
}
