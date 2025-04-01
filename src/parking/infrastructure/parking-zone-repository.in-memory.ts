import { Zone } from 'src/parking/domain/Zone';
import { ZoneCoordinates } from 'src/parking/domain/ZoneCoordinates';
import { ParkingZoneRepository } from 'src/parking/infrastructure/parking-zone-repository.port';

export class ParkingZoneRepositoryInMemory implements ParkingZoneRepository {
  zones: Zone[];
  constructor() {
    this.zones = [];
  }
  async findClosestZoneByCoordinates(
    coordinates: ZoneCoordinates,
  ): Promise<Zone | null> {
    return (
      this.zones.find((zone) => zone.props.coordinates.equals(coordinates)) ??
      null
    );
  }

  async save(zone: Zone): Promise<void> {
    this.zones.push(zone);
  }
}
