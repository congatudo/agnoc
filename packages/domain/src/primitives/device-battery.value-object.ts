import { ValueObject, ArgumentOutOfRangeException, ArgumentInvalidException } from '@agnoc/toolkit';
import type { DomainPrimitive } from '@agnoc/toolkit';

/** Minimum value for device battery. */
export const DeviceBatteryMinValue = 0;

/** Maximum value for device battery. */
export const DeviceBatteryMaxValue = 100;

/** Describes a device battery value. */
export class DeviceBattery extends ValueObject<number> {
  /**
   * Returns device battery value.
   *
   * Allowed values from {@link DeviceBatteryMinValue} to {@link DeviceBatteryMaxValue}.
   */
  get value(): number {
    return this.props.value;
  }

  protected validate(props: DomainPrimitive<number>): void {
    if (typeof props.value !== 'number') {
      throw new ArgumentInvalidException(`Value '${props.value as string}' for device battery is not a number`);
    }

    if (props.value < DeviceBatteryMinValue || props.value > DeviceBatteryMaxValue) {
      throw new ArgumentOutOfRangeException(`Value '${props.value}' for device battery is out of range`);
    }
  }
}
