import { Parking } from 'src/parking/domain/Parking';
import { UniqueEntityID } from 'src/shared/unique-entity-id';

export interface ParkingRepository {
  save(parking: Parking): Promise<void>;
  findById(id: UniqueEntityID): Promise<Parking | null>;
}
