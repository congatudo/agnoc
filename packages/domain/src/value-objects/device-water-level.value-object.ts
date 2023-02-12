import { ValueObject, isPresent, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
import type { ValueOf, DomainPrimitive } from '@agnoc/toolkit';

const VALUE = {
  OFF: 'off',
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export type DeviceWaterLevelValue = ValueOf<typeof VALUE>;

export class DeviceWaterLevel extends ValueObject<DeviceWaterLevelValue> {
  get value(): DeviceWaterLevelValue {
    return this.props.value;
  }

  protected validate(props: DomainPrimitive<DeviceWaterLevelValue>): void {
    if (![props.value].every(isPresent)) {
      throw new ArgumentNotProvidedException('Missing property in device water level constructor');
    }

    if (!Object.values(VALUE).includes(props.value)) {
      throw new ArgumentInvalidException('Invalid property in device water level constructor');
    }
  }

  static VALUE = VALUE;
}
