import { DriverParkEndUseCase } from 'src/parking/application/driver-leave.use-case';
import { ParkingAlreadyEndedError } from 'src/parking/domain/errors/parking-already-ended.error';
import { ParkingNotFoundError } from 'src/parking/domain/errors/parking-not-found.error';
import { Parking } from 'src/parking/domain/Parking';
import { ParkingRepositoryInMemory } from 'src/parking/infrastructure/parking-repository.in-memory';
import { ParkingRepository } from 'src/parking/infrastructure/parking-repository.port';
import { UniqueEntityID } from 'src/shared/unique-entity-id';

describe('Feature : User leave parking', () => {
  let useCase: DriverParkEndUseCase;
  let parkingRepository: ParkingRepository;

  beforeEach(() => {
    parkingRepository = new ParkingRepositoryInMemory();
    useCase = new DriverParkEndUseCase(parkingRepository);
  });
  it('should save end date of parking session', async () => {
    await parkingRepository.save(
      new Parking({
        id: new UniqueEntityID('parking-id'),
        driverId: new UniqueEntityID('driver-id'),
        timerStartDateTime: new Date(),
        zoneId: new UniqueEntityID('zone-id'),
      }),
    );
    const payload = {
      driverId: new UniqueEntityID('driver-id'),
      parkingId: new UniqueEntityID('parking-id'),
    };
    const maybeParking = await useCase.execute(payload);
    if (maybeParking.isErr()) {
      throw new Error('Parking should be created');
    }
    const parking = await parkingRepository.findById(payload.parkingId);
    expect(parking?.props.timerEndDateTime).not.toBeNull();
  });
  it('should return parking not found error', async () => {
    const payload = {
      driverId: new UniqueEntityID('driver-id'),
      parkingId: new UniqueEntityID('parking-id'),
    };
    const maybeParking = await useCase.execute(payload);
    if (maybeParking.isOk()) {
      throw new Error('Parking not found error should be returned');
    }
    expect(maybeParking.isErr()).toBe(true);
    expect(maybeParking.error).toBeInstanceOf(ParkingNotFoundError);
  });
  it('should return an error if parking already ended', async () => {
    const parking = new Parking({
      id: new UniqueEntityID('parking-id'),
      driverId: new UniqueEntityID('driver-id'),
      timerStartDateTime: new Date(),
      timerEndDateTime: new Date(),
      zoneId: new UniqueEntityID('zone-id'),
    });
    await parkingRepository.save(parking);

    const payload = {
      driverId: new UniqueEntityID('driver-id'),
      parkingId: new UniqueEntityID('parking-id'),
    };
    const maybeParking = await useCase.execute(payload);
    if (maybeParking.isOk()) {
      throw new Error('Parking already ended error should be returned');
    }
    expect(maybeParking.isErr()).toBe(true);
    expect(maybeParking.error).toBeInstanceOf(ParkingAlreadyEndedError);
  });
});
