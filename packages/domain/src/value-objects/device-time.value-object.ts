import { ValueObject, isPresent, ArgumentNotProvidedException } from '@agnoc/toolkit';

export interface DeviceTimeProps {
  hour: number;
  minute: number;
}

export class DeviceTime extends ValueObject<DeviceTimeProps> {
  get hour(): number {
    return this.props.hour;
  }

  get minute(): number {
    return this.props.minute;
  }

  toMinutes(): number {
    return this.props.hour * 60 + this.props.minute;
  }

  static fromMinutes(minutes: number): DeviceTime {
    return new DeviceTime({
      hour: Math.floor(minutes / 60),
      minute: minutes % 60,
    });
  }

  protected validate(props: DeviceTimeProps): void {
    if (![props.hour, props.minute].every(isPresent)) {
      throw new ArgumentNotProvidedException('Missing property in device time constructor');
    }
  }
}
