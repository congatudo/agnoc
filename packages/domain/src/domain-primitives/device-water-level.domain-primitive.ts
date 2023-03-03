import { DomainPrimitive } from '@agnoc/toolkit';

/** Describes a device water level value. */
export enum DeviceWaterLevelValue {
  Off = 'Off',
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

/**
 * Describes a device water level value.
 *
 * Allowed values from {@link DeviceWaterLevelValue}.
 */
export class DeviceWaterLevel extends DomainPrimitive<DeviceWaterLevelValue> {
  protected validate(props: DomainPrimitive<DeviceWaterLevelValue>): void {
    this.validateInListProp(props, 'value', Object.values(DeviceWaterLevelValue));
  }
}
