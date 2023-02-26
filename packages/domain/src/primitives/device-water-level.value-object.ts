import { ValueObject, ArgumentInvalidException } from '@agnoc/toolkit';
import type { DomainPrimitive } from '@agnoc/toolkit';

/** Describes a device water level value. */
export enum DeviceWaterLevelValue {
  Off = 'Off',
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

/** Describes a device water level value. */
export class DeviceWaterLevel extends ValueObject<DeviceWaterLevelValue> {
  /**
   * Returns device water level value.
   *
   * Allowed values from {@link DeviceWaterLevelValue}.
   */
  get value(): DeviceWaterLevelValue {
    return this.props.value;
  }

  protected validate(props: DomainPrimitive<DeviceWaterLevelValue>): void {
    if (!Object.values(DeviceWaterLevelValue).includes(props.value)) {
      throw new ArgumentInvalidException(`Value '${props.value}' for device water level is invalid`);
    }
  }
}
