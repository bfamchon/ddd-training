import { ValueObject } from 'src/libs/shared-kernel/value-object';

type StatusType = 'PENDING' | 'APPROVED' | 'REJECTED';
type StatusProperties = {
  value: StatusType;
};

export class Status extends ValueObject<StatusProperties> {
  constructor(value: StatusProperties) {
    super(value);
  }
  get value(): StatusType {
    return this.props.value;
  }
  canChangeTo(newStatus: StatusType): boolean {
    const validTransitions: Record<StatusType, StatusType[]> = {
      PENDING: ['APPROVED', 'REJECTED'],
      APPROVED: [],
      REJECTED: [],
    };
    return validTransitions[this.value].includes(newStatus);
  }
  static create(value: StatusType): Status {
    return new Status({ value });
  }
}
