import { ValueObject, isPresent, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
import type { DomainPrimitive } from '@agnoc/toolkit';

export enum DeviceStateValue {
  Error = 'error',
  Docked = 'docked',
  Idle = 'idle',
  Returning = 'returning',
  Cleaning = 'cleaning',
  Paused = 'paused',
  ManualControl = 'manual_control',
  Moving = 'moving',
}

export class DeviceState extends ValueObject<DeviceStateValue> {
  get value(): DeviceStateValue {
    return this.props.value;
  }

  protected validate(props: DomainPrimitive<DeviceStateValue>): void {
    if (![props.value].every(isPresent)) {
      throw new ArgumentNotProvidedException('Missing property in device state constructor');
    }

    if (!Object.values(DeviceStateValue).includes(props.value)) {
      throw new ArgumentInvalidException('Invalid property in device state constructor');
    }
  }
}
