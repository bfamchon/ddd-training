import { Zone } from 'src/parking/domain/Zone';
import { ZoneCoordinates } from 'src/parking/domain/ZoneCoordinates';

export interface ParkingZoneRepository {
  findClosestZoneByCoordinates(
    coordinates: ZoneCoordinates,
  ): Promise<Zone | null>;
}
