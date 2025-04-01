import { IDomainEvent } from 'src/shared/domain-events';
import { UniqueEntityID } from 'src/shared/unique-entity-id';

export class DriverEndParking implements IDomainEvent {
  public readonly eventName = 'DriverEndParking';
  public readonly occurredOn: Date;
  public readonly driverId: string;
  public readonly parkingId: string;
  public readonly zoneId: string;

  constructor(driverId: string, zoneId: string, parkingId: string) {
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
