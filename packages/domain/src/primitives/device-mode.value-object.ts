import { ValueObject, ArgumentInvalidException } from '@agnoc/toolkit';
import type { DomainPrimitive } from '@agnoc/toolkit';

/** Describes a device mode value. */
export enum DeviceModeValue {
  None = 'None',
  Spot = 'Spot',
  Zone = 'Zone',
  Mop = 'Mop',
}

/** Describes a device mode value. */
export class DeviceMode extends ValueObject<DeviceModeValue> {
  /**
   * Returns device mode value.
   *
   * Allowed values from {@link DeviceModeValue}.
   */
  get value(): DeviceModeValue {
    return this.props.value;
  }

  protected validate(props: DomainPrimitive<DeviceModeValue>): void {
    if (!Object.values(DeviceModeValue).includes(props.value)) {
      throw new ArgumentInvalidException(`Value '${props.value}' for device mode is invalid`);
    }
  }
}
