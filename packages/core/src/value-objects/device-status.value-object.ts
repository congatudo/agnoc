import { ValueObject } from "../base-classes/value-object.base";
import { ArgumentNotProvidedException } from "../exceptions/argument-not-provided.exception";
import { isPresent } from "../utils/is-present.util";

// TODO: convert all to value-objects

export const DEVICE_ERROR = {
  NO_DEPOSIT: "no_deposit",
  NO_GROUND: "no_ground",
  UNKNOWN: "unknown",
} as const;

export type DeviceError = typeof DEVICE_ERROR[keyof typeof DEVICE_ERROR];

export interface DeviceStatusProps {
  currentCleanSize: number;
  currentCleanTime: number;
  error: DeviceError;
}

export class DeviceStatus extends ValueObject<DeviceStatusProps> {
  get currentCleanSize(): number {
    return this.props.currentCleanSize;
  }

  get currentCleanTime(): number {
    return this.props.currentCleanTime;
  }

  get error(): DeviceError {
    return this.props.error;
  }

  protected validate(props: DeviceStatusProps): void {
    if (
      ![props.currentCleanSize, props.currentCleanTime, props.error].every(
        isPresent
      )
    ) {
      throw new ArgumentNotProvidedException(
        "Missing property in device status constructor"
      );
    }
  }

  static getError({ faultCode }: { faultCode: number }): DeviceError {
    switch (faultCode) {
      case 501:
        return DEVICE_ERROR.NO_GROUND;
      case 503:
        return DEVICE_ERROR.NO_DEPOSIT;
      default:
        return DEVICE_ERROR.UNKNOWN;
    }
  }
}
