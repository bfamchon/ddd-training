import { ZoneCoordinates } from 'src/parking/domain/ZoneCoordinates';
import { Entity } from 'src/shared/entity';
import { UniqueEntityID } from 'src/shared/unique-entity-id';

type ZoneProps = {
  id: UniqueEntityID;
  coordinates: ZoneCoordinates;
};

export class Zone extends Entity<ZoneProps> {
  private constructor(zone: ZoneProps) {
    super(zone);
  }

  public static create(zone: ZoneProps): Zone {
    return new Zone(zone);
  }
}
