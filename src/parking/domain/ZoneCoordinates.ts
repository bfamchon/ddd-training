import { ValueObject } from 'src/libs/shared-kernel/value-object';

type ZoneCoordinatesProps = {
  latitude: number;
  longitude: number;
};

export class ZoneCoordinates extends ValueObject<ZoneCoordinatesProps> {
  private constructor(props: ZoneCoordinatesProps) {
    super(props);
  }

  public static create(coordinates: ZoneCoordinatesProps): ZoneCoordinates {
    const { latitude, longitude } = coordinates;
    if (latitude < -90 || latitude > 90) {
      throw new Error('Invalid latitude');
    }
    if (longitude < -180 || longitude > 180) {
      throw new Error('Invalid longitude');
    }
    return new ZoneCoordinates(coordinates);
  }
}
