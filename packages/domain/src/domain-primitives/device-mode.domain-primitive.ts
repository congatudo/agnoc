import { ArgumentInvalidException, DomainPrimitive } from '@agnoc/toolkit';

/** Describes a device mode value. */
export enum DeviceModeValue {
  None = 'None',
  Spot = 'Spot',
  Zone = 'Zone',
  Mop = 'Mop',
}

/**
 * Describes a device mode value.
 *
 * Allowed values from {@link DeviceModeValue}.
 */
export class DeviceMode extends DomainPrimitive<DeviceModeValue> {
  protected validate(props: DomainPrimitive<DeviceModeValue>): void {
    if (!Object.values(DeviceModeValue).includes(props.value)) {
      throw new ArgumentInvalidException(`Value '${props.value}' for ${this.constructor.name} is invalid`);
    }
  }
}
