import { ValueObject, isPresent, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
import type { DomainPrimitive } from '@agnoc/toolkit';

export enum DeviceWaterLevelValue {
  Off = 'off',
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export class DeviceWaterLevel extends ValueObject<DeviceWaterLevelValue> {
  get value(): DeviceWaterLevelValue {
    return this.props.value;
  }

  protected validate(props: DomainPrimitive<DeviceWaterLevelValue>): void {
    if (![props.value].every(isPresent)) {
      throw new ArgumentNotProvidedException('Missing property in device water level constructor');
    }

    if (!Object.values(DeviceWaterLevelValue).includes(props.value)) {
      throw new ArgumentInvalidException('Invalid property in device water level constructor');
    }
  }
}
