import { EventBus } from '@nestjs/cqrs';
import {
  FakeIDGenerator,
  IDGenerator,
  UniqueEntityID,
} from 'src/libs/shared-kernel/unique-entity-id';
import { DriverParkUseCase } from 'src/parking/application/driver-park-start.use-case';
import { ZoneNotFoundError } from 'src/parking/domain/errors/zone-not-found.error';
import { Zone } from 'src/parking/domain/Zone';
import { ZoneCoordinates } from 'src/parking/domain/ZoneCoordinates';
import { ParkingRepositoryInMemory } from 'src/parking/infrastructure/parking-repository.in-memory';
import { ParkingRepository } from 'src/parking/infrastructure/parking-repository.port';
import { ParkingZoneRepositoryInMemory } from 'src/parking/infrastructure/parking-zone-repository.in-memory';
import { TestApp } from 'src/test/utils/test-app';

describe('Feature : User park its car', () => {
  let useCase: DriverParkUseCase;
  let parkingRepository: ParkingRepository;
  let parkingZoneRepository: ParkingZoneRepositoryInMemory;
  let idGenerator: IDGenerator;
  let app: TestApp;
  let eventBus: EventBus;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    eventBus = app.get<EventBus>(EventBus);
    // Mock the event bus
    jest.spyOn(eventBus, 'publish').mockImplementation(() => undefined);

    parkingRepository = new ParkingRepositoryInMemory(eventBus);
    parkingZoneRepository = new ParkingZoneRepositoryInMemory();
    idGenerator = new FakeIDGenerator();
    await parkingZoneRepository.save(
      Zone.create({
        id: new UniqueEntityID('zone-id'),
        coordinates: ZoneCoordinates.create({ latitude: 1, longitude: 1 }),
      }),
    );

    useCase = new DriverParkUseCase(
      parkingRepository,
      parkingZoneRepository,
      idGenerator,
    );
  });
  it('should create a parking', async () => {
    const payload = {
      driverId: new UniqueEntityID('driver-id'),
      zoneCoordinates: ZoneCoordinates.create({ latitude: 1, longitude: 1 }),
    };
    const maybeParking = await useCase.execute(payload);
    if (maybeParking.isErr()) {
      throw new Error('Parking should be created');
    }
    const parking = await parkingRepository.findById(maybeParking.value);
    console.log(parking);
    expect(parking?.props.id.toString()).toBe('fake-id');
  });
  it('should return zone not found error', async () => {
    const payload = {
      driverId: new UniqueEntityID('driver-id'),
      zoneCoordinates: ZoneCoordinates.create({ latitude: 2, longitude: 2 }),
    };
    const maybeParking = await useCase.execute(payload);
    if (maybeParking.isOk()) {
      throw new Error('Zone not found error should be returned');
    }
    expect(maybeParking.isErr()).toBe(true);
    expect(maybeParking.error).toBeInstanceOf(ZoneNotFoundError);
  });
});
