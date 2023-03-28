import { DomainPrimitive } from '@agnoc/toolkit';

/** The possible values of a device state. */
export enum DeviceStateValue {
  Error = 'Error',
  Docked = 'Docked',
  Idle = 'Idle',
  Returning = 'Returning',
  Cleaning = 'Cleaning',
  Paused = 'Paused',
  ManualControl = 'ManualControl',
  Moving = 'Moving',
}

/** Describe the state of a device. */
export class DeviceState extends DomainPrimitive<DeviceStateValue> {
  protected validate(props: DomainPrimitive<DeviceStateValue>): void {
    this.validateListProp(props, 'value', Object.values(DeviceStateValue));
  }
}
