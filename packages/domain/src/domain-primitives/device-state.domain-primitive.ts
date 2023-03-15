import { DomainPrimitive } from '@agnoc/toolkit';

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
    this.validateListProp(props, 'value', Object.values(DeviceStateValue));
  }
}
