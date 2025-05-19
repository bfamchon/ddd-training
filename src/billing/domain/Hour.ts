import { ValueObject } from 'src/libs/shared-kernel/value-object';

type HourProps = {
  value: number;
};

export class Hour extends ValueObject<HourProps> {
  constructor(value: number) {
    super({ value });
  }

  get value(): number {
    return this.props.value;
  }

  public static create(hour: number): Hour {
    if (hour < 0 || hour > 24) {
      throw new Error('Hour must be between 0 and 24');
    }
    return new Hour(Math.ceil(hour));
  }
}
