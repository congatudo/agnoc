import { ValueObject, isPresent, ArgumentNotProvidedException } from '@agnoc/toolkit';
import type { ValueOf } from '@agnoc/toolkit';

export interface DeviceSystemProps {
  deviceSerialNumber: string;
  deviceMac: string;
  deviceType: number;
  customerFirmwareId: number;
  ctrlVersion: string;
}

export const DEVICE_MODEL = {
  C3090: 'C3090',
  C3490: 'C3490',
  UNKNOWN: 'unknown',
} as const;

export type DeviceModel = (typeof DEVICE_MODEL)[keyof typeof DEVICE_MODEL];

export const DEVICE_TYPE = {
  3: DEVICE_MODEL.C3090,
  9: DEVICE_MODEL.C3490,
} as const;

export type DeviceType = keyof typeof DEVICE_TYPE;

export const DEVICE_CAPABILITY = {
  MAP_PLANS: 0x0001,
  WATER_SENSOR: 0x0002,
  CONSUMABLES: 0x0004,
} as const;

export type DeviceCapability = ValueOf<typeof DEVICE_CAPABILITY>;

export const MODEL_CAPABILITY = {
  [DEVICE_MODEL.C3090]: 0,
  [DEVICE_MODEL.C3490]: DEVICE_CAPABILITY.MAP_PLANS | DEVICE_CAPABILITY.WATER_SENSOR | DEVICE_CAPABILITY.CONSUMABLES,
  [DEVICE_MODEL.UNKNOWN]: DEVICE_CAPABILITY.MAP_PLANS | DEVICE_CAPABILITY.WATER_SENSOR | DEVICE_CAPABILITY.CONSUMABLES,
} as const;

export class DeviceSystem extends ValueObject<DeviceSystemProps> {
  get model(): DeviceModel {
    return DEVICE_TYPE[this.props.deviceType as DeviceType] || DEVICE_MODEL.UNKNOWN;
  }

  get capabilities(): number {
    return MODEL_CAPABILITY[this.model];
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
