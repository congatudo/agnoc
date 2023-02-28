import { ArgumentOutOfRangeException, ArgumentInvalidException, DomainPrimitive } from '@agnoc/toolkit';
import type { DomainPrimitiveProps } from '@agnoc/toolkit';

/** Minimum value for device battery. */
export const DeviceBatteryMinValue = 0;

/** Maximum value for device battery. */
export const DeviceBatteryMaxValue = 100;

/**
 * Describes a device battery value.
 *
 * Allowed values from {@link DeviceBatteryMinValue} to {@link DeviceBatteryMaxValue}.
 */
export class DeviceBattery extends DomainPrimitive<number> {
  protected validate({ value }: DomainPrimitiveProps<number>): void {
    if (typeof value !== 'number') {
      throw new ArgumentInvalidException(`Value '${value as string}' for ${this.constructor.name} is not a number`);
    }

    if (value < DeviceBatteryMinValue || value > DeviceBatteryMaxValue) {
      throw new ArgumentOutOfRangeException(`Value '${value}' for ${this.constructor.name} is out of range`);
    }
  }
}
