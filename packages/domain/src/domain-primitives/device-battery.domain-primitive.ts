import { DomainPrimitive } from '@agnoc/toolkit';
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
  protected validate(props: DomainPrimitiveProps<number>): void {
    this.validateNumberProp(props, 'value');
    this.validateNumberProp(props, 'value', { min: DeviceBatteryMinValue, max: DeviceBatteryMaxValue });
  }
}
