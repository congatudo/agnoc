import { ValueObject, isPresent, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
import type { DomainPrimitive } from '@agnoc/toolkit';

export enum DeviceModeValue {
  None = 'none',
  Spot = 'spot',
  Zone = 'zone',
  Mop = 'mop',
}

export class DeviceMode extends ValueObject<DeviceModeValue> {
  get value(): DeviceModeValue {
    return this.props.value;
  }

  protected validate(props: DomainPrimitive<DeviceModeValue>): void {
    if (![props.value].every(isPresent)) {
      throw new ArgumentNotProvidedException('Missing property in device mode constructor');
    }

    if (!Object.values(DeviceModeValue).includes(props.value)) {
      throw new ArgumentInvalidException('Invalid property in device mode constructor');
    }
  }
}
