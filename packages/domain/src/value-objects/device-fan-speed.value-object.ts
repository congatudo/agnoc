import { ValueObject, isPresent, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
import type { DomainPrimitive } from '@agnoc/toolkit';

export enum DeviceFanSpeedValue {
  Off = 'off',
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export class DeviceFanSpeed extends ValueObject<DeviceFanSpeedValue> {
  get value(): DeviceFanSpeedValue {
    return this.props.value;
  }

  protected validate(props: DomainPrimitive<DeviceFanSpeedValue>): void {
    if (![props.value].every(isPresent)) {
      throw new ArgumentNotProvidedException('Missing property in device fan speed constructor');
    }

    if (!Object.values(DeviceFanSpeedValue).includes(props.value)) {
      throw new ArgumentInvalidException('Invalid property in device fan speed constructor');
    }
  }
}
