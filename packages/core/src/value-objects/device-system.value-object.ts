import { ValueObject } from "../base-classes/value-object.base";
import { ArgumentNotProvidedException } from "../exceptions/argument-not-provided.exception";
import { isPresent } from "../utils/is-present.util";

export interface DeviceSystemProps {
  deviceSerialNumber: string;
  deviceMac: string;
  deviceType: number;
  customerFirmwareId: number;
  ctrlVersion: string;
  softwareVersion: string;
  hardwareVersion: string;
}

export const DEVICE_MODEL = {
  C3090: "C3090",
  C3490: "C3490",
  UNKNOWN: "unknown",
} as const;

export type DeviceModel = typeof DEVICE_MODEL[keyof typeof DEVICE_MODEL];

export const DEVICE_TYPE = {
  3: DEVICE_MODEL.C3090,
  9: DEVICE_MODEL.C3490,
} as const;

export type DeviceType = keyof typeof DEVICE_TYPE;

export class DeviceSystem extends ValueObject<DeviceSystemProps> {
  get model(): DeviceModel {
    return (
      DEVICE_TYPE[this.props.deviceType as DeviceType] || DEVICE_MODEL.UNKNOWN
    );
  }

  protected validate(props: DeviceSystemProps): void {
    if (
      ![
        props.softwareVersion,
        props.hardwareVersion,
        props.deviceSerialNumber,
        props.deviceMac,
        props.deviceType,
        props.customerFirmwareId,
        props.ctrlVersion,
      ].map(isPresent)
    ) {
      throw new ArgumentNotProvidedException(
        "Missing property in device system constructor"
      );
    }
  }
}
