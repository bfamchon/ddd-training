import { ZoneNotFoundError } from 'src/parking/domain/errors/zone-not-found.error';
import { Parking } from 'src/parking/domain/Parking';
import { ZoneCoordinates } from 'src/parking/domain/ZoneCoordinates';
import { ParkingRepository } from 'src/parking/infrastructure/parking-repository.port';
import { ParkingZoneRepository } from 'src/parking/infrastructure/parking-zone-repository.port';
import { Err, Ok, Result } from 'src/shared/result';
import { IDGenerator, UniqueEntityID } from 'src/shared/unique-entity-id';

type Request = {
  driverId: UniqueEntityID;
  zoneCoordinates: ZoneCoordinates;
};

type Response = Result<UniqueEntityID, ZoneNotFoundError>;

export class DriverParkUseCase {
  constructor(
    private parkingRepository: ParkingRepository,
    private parkingZoneRepository: ParkingZoneRepository,
    private idGenerator: IDGenerator,
  ) {}

  async execute({ driverId, zoneCoordinates }: Request): Promise<Response> {
    const zone =
      await this.parkingZoneRepository.findClosestZoneByCoordinates(
        zoneCoordinates,
      );
    if (!zone) {
      return Err.of(new ZoneNotFoundError());
    }

    const generatedId = this.idGenerator.generate();
    const parking = new Parking({
      driverId,
      zoneId: zone.props.id,
      timerStartDateTime: new Date(),
      id: generatedId,
    });

    await this.parkingRepository.save(parking);
    return Ok.of(generatedId);
  }
}
