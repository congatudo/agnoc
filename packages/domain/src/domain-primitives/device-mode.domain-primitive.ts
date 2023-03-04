import { DomainPrimitive } from '@agnoc/toolkit';

/** Describes a device mode value. */
export enum DeviceModeValue {
  None = 'None',
  Spot = 'Spot',
  Zone = 'Zone',
  Mop = 'Mop',
}

/**
 * Describes a device mode value.
 *
 * Allowed values from {@link DeviceModeValue}.
 */
export class DeviceMode extends DomainPrimitive<DeviceModeValue> {
  protected validate(props: DomainPrimitive<DeviceModeValue>): void {
    this.validateListProp(props, 'value', Object.values(DeviceModeValue));
  }
}
