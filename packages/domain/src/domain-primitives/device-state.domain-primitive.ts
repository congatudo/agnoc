import { ArgumentInvalidException, DomainPrimitive } from '@agnoc/toolkit';

/** The possible values of a device state. */
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

/** Describe the state of a device. */
export class DeviceState extends DomainPrimitive<DeviceStateValue> {
  protected validate(props: DomainPrimitive<DeviceStateValue>): void {
    if (!Object.values(DeviceStateValue).includes(props.value)) {
      throw new ArgumentInvalidException(`Value '${props.value}' for ${this.constructor.name} is invalid`);
    }
  }
}
