import { ValueObject, isPresent, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
import type { ValueOf, DomainPrimitive } from '@agnoc/toolkit';

const VALUE = {
  OFF: 'off',
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export type DeviceFanSpeedValue = ValueOf<typeof VALUE>;

export class DeviceFanSpeed extends ValueObject<DeviceFanSpeedValue> {
  get value(): DeviceFanSpeedValue {
    return this.props.value;
  }

  protected validate(props: DomainPrimitive<DeviceFanSpeedValue>): void {
    if (![props.value].every(isPresent)) {
      throw new ArgumentNotProvidedException('Missing property in device fan speed constructor');
    }

    if (!Object.values(VALUE).includes(props.value)) {
      throw new ArgumentInvalidException('Invalid property in device fan speed constructor');
    }
  }

  static VALUE = VALUE;
}
