import { ValueObject } from '@agnoc/toolkit';

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
    const keys: (keyof DeviceTimeProps)[] = ['hours', 'minutes'];

    keys.forEach((prop) => {
      this.validateDefinedProp(props, prop);
      this.validateNumberProp(props, prop);
    });

    this.validateNumberProp(props, 'hours', { min: 0, max: 23 });
    this.validateNumberProp(props, 'minutes', { min: 0, max: 59 });
  }
}
