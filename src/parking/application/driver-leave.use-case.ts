import { Err, Ok, Result } from 'src/libs/shared-kernel/result';
import { UniqueEntityID } from 'src/libs/shared-kernel/unique-entity-id';
import { ParkingNotFoundError } from 'src/parking/domain/errors/parking-not-found.error';
import { ParkingRepository } from 'src/parking/infrastructure/parking-repository.port';

type Request = {
  driverId: UniqueEntityID;
  parkingId: UniqueEntityID;
};

type Response = Result<void, Error>;

export class DriverParkEndUseCase {
  constructor(private parkingRepository: ParkingRepository) {}

  async execute({ parkingId }: Request): Promise<Response> {
    const parking = await this.parkingRepository.findById(parkingId);
    if (!parking) {
      return Err.of(new ParkingNotFoundError());
    }

    try {
      parking.endParking();
      await this.parkingRepository.save(parking);
      return Ok.of(undefined);
    } catch (error) {
      return Err.of(error);
    }
  }
}
