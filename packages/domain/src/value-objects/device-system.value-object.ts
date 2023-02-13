import { ValueObject, isPresent, ArgumentNotProvidedException } from '@agnoc/toolkit';
import type { ValueOf } from '@agnoc/toolkit';

export interface DeviceSystemProps {
  deviceSerialNumber: string;
  deviceMac: string;
  deviceType: number;
  customerFirmwareId: number;
  ctrlVersion: string;
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

export class DeviceSystem extends ValueObject<DeviceSystemProps> {
  get model(): DeviceModel {
    return DeviceType[this.props.deviceType as DeviceType] || DeviceModel.UNKNOWN;
  }

  get capabilities(): number {
    return DeviceModelCapability[this.model];
  }

  supports(capability: DeviceCapability): boolean {
    return Boolean(this.capabilities & capability);
  }

  protected validate(props: DeviceSystemProps): void {
    if (
      ![props.deviceSerialNumber, props.deviceMac, props.deviceType, props.customerFirmwareId, props.ctrlVersion].every(
        isPresent,
      )
    ) {
      throw new ArgumentNotProvidedException('Missing property in device system constructor');
    }
  }
}
