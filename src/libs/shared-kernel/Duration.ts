import { ValueObject } from 'src/libs/shared-kernel/value-object';

type DurationProps = {
  milliseconds: number;
};

export class Duration extends ValueObject<DurationProps> {
  private constructor(milliseconds: number) {
    super({ milliseconds });
  }

  static fromMilliseconds(ms: number): Duration {
    if (ms < 0) throw new Error('Duration cannot be negative');
    return new Duration(ms);
  }

  static fromSeconds(seconds: number): Duration {
    return new Duration(seconds * 1000);
  }

  static fromMinutes(minutes: number): Duration {
    return new Duration(minutes * 60 * 1000);
  }

  static fromHours(hours: number): Duration {
    return new Duration(hours * 60 * 60 * 1000);
  }

  toMilliseconds(): number {
    return this.props.milliseconds;
  }

  toSeconds(): number {
    return this.props.milliseconds / 1000;
  }

  toMinutes(): number {
    return this.props.milliseconds / (60 * 1000);
  }

  toHours(): number {
    return this.props.milliseconds / (60 * 60 * 1000);
  }
}
