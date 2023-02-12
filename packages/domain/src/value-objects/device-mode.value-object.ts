import { ValueObject, isPresent, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
import type { ValueOf, DomainPrimitive } from '@agnoc/toolkit';

const VALUE = {
  NONE: 'none',
  SPOT: 'spot',
  ZONE: 'zone',
  MOP: 'mop',
} as const;

export type DeviceModeValue = ValueOf<typeof VALUE>;

export class DeviceMode extends ValueObject<DeviceModeValue> {
  get value(): DeviceModeValue {
    return this.props.value;
  }

  protected validate(props: DomainPrimitive<DeviceModeValue>): void {
    if (![props.value].every(isPresent)) {
      throw new ArgumentNotProvidedException('Missing property in device mode constructor');
    }

    if (!Object.values(VALUE).includes(props.value)) {
      throw new ArgumentInvalidException('Invalid property in device mode constructor');
    }
  }

  static VALUE = VALUE;
}
