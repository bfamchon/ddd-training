import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Parking } from 'src/parking/domain/Parking';
import { UniqueEntityID } from 'src/shared/unique-entity-id';
import { ParkingRepository } from './parking-repository.port';

@Injectable()
export class ParkingRepositoryInMemory implements ParkingRepository {
  private parkings: Parking[];

  constructor(private eventBus: EventBus) {
    this.parkings = [];
  }
  save(parking: Parking): Promise<void> {
    const existingIndex = this.parkings.findIndex((p) =>
      p.props.id.equals(parking.props.id),
    );

    if (existingIndex >= 0) {
      this.parkings[existingIndex] = parking;
    } else {
      this.parkings.push(parking);
    }

    // Publier les événements de domaine
    const events = parking.domainEvents;
    if (events.length > 0) {
      events.forEach((event) => {
        this.eventBus.publish(event);
      });
      parking.clearEvents();
    }

    return Promise.resolve();
  }

  findById(id: UniqueEntityID): Promise<Parking | null> {
    return Promise.resolve(
      this.parkings.find((parking) => parking.props.id.equals(id)) || null,
    );
  }
}
