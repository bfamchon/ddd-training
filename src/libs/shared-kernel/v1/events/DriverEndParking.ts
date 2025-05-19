import { IDomainEvent } from 'src/libs/shared-kernel/domain-events';
import { UniqueEntityID } from 'src/libs/shared-kernel/unique-entity-id';

export class DriverEndParking implements IDomainEvent {
  public readonly eventName = 'DriverEndParking';
  public readonly occurredOn: Date;
  public readonly driverId: string;
  public readonly parkingId: string;
  public readonly zoneId: string;
  public readonly sessionDuration: number;

  constructor(
    driverId: string,
    zoneId: string,
    parkingId: string,
    sessionDuration: number,
  ) {
    this.sessionDuration = sessionDuration;
    this.occurredOn = new Date();
    this.driverId = driverId;
    this.parkingId = parkingId;
    this.zoneId = zoneId;
  }

  get dateTimeOccurred(): Date {
    return this.occurredOn;
  }

  getAggregateId(): UniqueEntityID {
    return new UniqueEntityID(this.parkingId);
  }
}
