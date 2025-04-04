import { ParkingAlreadyEndedError } from 'src/parking/domain/errors/parking-already-ended.error';
import { ParkingNotEndedError } from 'src/parking/domain/errors/parking-not-ended.error';
import { DriverEndParking } from 'src/parking/domain/events/DriverEndParking';
import { AggregateRoot } from 'src/shared/aggregate-root';
import { Duration } from 'src/shared/Duration';
import { UniqueEntityID } from 'src/shared/unique-entity-id';

type ParkingProps = {
  id: UniqueEntityID;
  timerStartDateTime: Date;
  timerEndDateTime?: Date;
  zoneId: UniqueEntityID;
  driverId: UniqueEntityID;
};

export class Parking extends AggregateRoot<ParkingProps> {
  constructor(parking: ParkingProps) {
    super(parking);
  }

  private calculateSessionDuration(): Duration {
    if (!this.props.timerEndDateTime) {
      throw new ParkingNotEndedError();
    }
    return Duration.fromMilliseconds(
      this.props.timerEndDateTime.getTime() -
        this.props.timerStartDateTime.getTime(),
    );
  }

  endParking() {
    if (this.props.timerEndDateTime) {
      throw new ParkingAlreadyEndedError();
    }
    this.props.timerEndDateTime = new Date();
    this.addDomainEvent(
      new DriverEndParking(
        this.props.driverId.toString(),
        this.props.zoneId.toString(),
        this.props.id.toString(),
        this.calculateSessionDuration().toMilliseconds(),
      ),
    );
  }
}
