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

export class DeviceSystem extends ValueObject<DeviceSystemProps> {
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
