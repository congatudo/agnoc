import { ValueObject } from '@agnoc/toolkit';
import type { ValueOf } from '@agnoc/toolkit';

/** Describes the device system properties. */
export interface DeviceSystemProps {
  type: number;
}

/** Describes the device system. */
export class DeviceSystem extends ValueObject<DeviceSystemProps> {
  /** Returns the device type. */
  get type(): number {
    return this.props.type;
  }

  /** Returns the device model. */
  get model(): DeviceModel {
    return DeviceType[this.props.type as DeviceType] || DeviceModel.UNKNOWN;
  }

  /** Returns the device capabilities. */
  get capabilities(): number {
    return DeviceModelCapability[this.model];
  }

  /** Returns true whether the device supports the given capability. */
  supports(capability: DeviceCapability): boolean {
    return Boolean(this.capabilities & capability);
  }

  protected validate(props: DeviceSystemProps): void {
    this.validateDefinedProp(props, 'type');
    this.validateNumberProp(props, 'type');
  }
}

export enum DeviceModel {
  C3090 = 'C3090',
  C3490 = 'C3490',
  UNKNOWN = 'unknown',
}

export const DeviceType = {
  3: DeviceModel.C3090,
  9: DeviceModel.C3490,
} as const;

export type DeviceType = keyof typeof DeviceType;

export const DeviceCapability = {
  MAP_PLANS: 0x0001,
  WATER_SENSOR: 0x0002,
  CONSUMABLES: 0x0004,
} as const;

export type DeviceCapability = ValueOf<typeof DeviceCapability>;

export const DeviceModelCapability = {
  [DeviceModel.C3090]: 0,
  [DeviceModel.C3490]: DeviceCapability.MAP_PLANS | DeviceCapability.WATER_SENSOR | DeviceCapability.CONSUMABLES,
  [DeviceModel.UNKNOWN]: DeviceCapability.MAP_PLANS | DeviceCapability.WATER_SENSOR | DeviceCapability.CONSUMABLES,
} as const;
