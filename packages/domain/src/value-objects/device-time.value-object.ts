import {
  ValueObject,
  isPresent,
  ArgumentNotProvidedException,
  ArgumentOutOfRangeException,
  ArgumentInvalidException,
} from '@agnoc/toolkit';

/** Properties for a device time. */
export interface DeviceTimeProps {
  hours: number;
  minutes: number;
}

/** Describes a point in time using `hours` and `minutes`. */
export class DeviceTime extends ValueObject<DeviceTimeProps> {
  /** Returns the `hours` in device time. Allowed values from `0` to `23`. */
  get hours(): number {
    return this.props.hours;
  }

  /** Returns the `minutes` in device time. Allowed values from `0` to `59`. */
  get minutes(): number {
    return this.props.minutes;
  }

  /** Returns minutes from device time. */
  toMinutes(): number {
    return this.props.hours * 60 + this.props.minutes;
  }

  /** Creates a new instance of `DeviceTime` from minutes. */
  static fromMinutes(minutes: number): DeviceTime {
    return new DeviceTime({
      hours: Math.floor(minutes / 60),
      minutes: minutes % 60,
    });
  }

  protected validate(props: DeviceTimeProps): void {
    const keys = ['hours', 'minutes'] as (keyof DeviceTimeProps)[];

    keys.forEach((prop) => {
      const value = props[prop];

      if (!isPresent(value)) {
        throw new ArgumentNotProvidedException(`Property '${prop}' for ${this.constructor.name} not provided`);
      }

      if (typeof value !== 'number') {
        throw new ArgumentInvalidException(
          `Value '${value as string}' for property '${prop}' for ${this.constructor.name} is not a number`,
        );
      }
    });

    if (props.hours < 0 || props.hours > 23) {
      throw new ArgumentOutOfRangeException(
        `Value '${props.hours}' for property 'hours' for ${this.constructor.name} is out of range`,
      );
    }

    if (props.minutes < 0 || props.minutes > 59) {
      throw new ArgumentOutOfRangeException(
        `Value '${props.minutes}' for property 'minutes' for ${this.constructor.name} is out of range`,
      );
    }
  }
}
