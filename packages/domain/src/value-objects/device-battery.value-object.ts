import { ValueObject, isPresent, ArgumentInvalidException, ArgumentNotProvidedException } from '@agnoc/toolkit';
import type { DomainPrimitive } from '@agnoc/toolkit';

export const DeviceBatteryMinValue = 0;
export const DeviceBatteryMaxValue = 100;

export class DeviceBattery extends ValueObject<number> {
  get value(): number {
    return this.props.value;
  }

  protected validate(props: DomainPrimitive<number>): void {
    if (![props.value].every(isPresent)) {
      throw new ArgumentNotProvidedException('Missing property in device fan speed constructor');
    }

    if (props.value < DeviceBatteryMinValue || props.value > DeviceBatteryMaxValue) {
      throw new ArgumentInvalidException('Invalid property in device battery constructor');
    }
  }
}
