import { ValueObject, ArgumentInvalidException } from '@agnoc/toolkit';
import type { DomainPrimitive } from '@agnoc/toolkit';

/** Describes a device fan speed value. */
export enum DeviceFanSpeedValue {
  Off = 'Off',
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

/** Describes a device fan speed value. */
export class DeviceFanSpeed extends ValueObject<DeviceFanSpeedValue> {
  /**
   * Returns device fan speed value.
   *
   * Allowed values from {@link DeviceFanSpeedValue}.
   */
  get value(): DeviceFanSpeedValue {
    return this.props.value;
  }

  protected validate(props: DomainPrimitive<DeviceFanSpeedValue>): void {
    if (!Object.values(DeviceFanSpeedValue).includes(props.value)) {
      throw new ArgumentInvalidException(`Value '${props.value}' for device fan speed is invalid`);
    }
  }
}
