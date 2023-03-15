import { DomainPrimitive } from '@agnoc/toolkit';

/** Describes a device fan speed value. */
export enum DeviceFanSpeedValue {
  Off = 'Off',
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

/**
 * Describes a device fan speed value.
 *
 * Allowed values from {@link DeviceFanSpeedValue}.
 */
export class DeviceFanSpeed extends DomainPrimitive<DeviceFanSpeedValue> {
  protected validate(props: DomainPrimitive<DeviceFanSpeedValue>): void {
    this.validateListProp(props, 'value', Object.values(DeviceFanSpeedValue));
  }
}
