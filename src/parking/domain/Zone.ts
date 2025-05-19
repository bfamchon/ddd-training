import { Entity } from 'src/libs/shared-kernel/entity';
import { UniqueEntityID } from 'src/libs/shared-kernel/unique-entity-id';
import { ZoneCoordinates } from 'src/parking/domain/ZoneCoordinates';

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
