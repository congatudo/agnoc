import { ValueObject } from "../base-classes/value-object.base";
import { ArgumentInvalidException } from "../exceptions/argument-invalid.exception";
import { ArgumentNotProvidedException } from "../exceptions/argument-not-provided.exception";
import { isPresent } from "../utils/is-present.util";

// TODO: convert all to value-objects

export const DEVICE_MODE = {
  NONE: "none",
  SPOT: "spot",
  ZONE: "zone",
  MOP: "mop",
  UNKNOWN: "unknown",
} as const;

export type DeviceMode = typeof DEVICE_MODE[keyof typeof DEVICE_MODE];

export const DEVICE_ERROR = {
  NO_DEPOSIT: "no_deposit",
  NO_GROUND: "no_ground",
  UNKNOWN: "unknown",
} as const;

export type DeviceError = typeof DEVICE_ERROR[keyof typeof DEVICE_ERROR];

export interface DeviceStatusProps {
  mode: DeviceMode;
  currentCleanSize: number;
  currentCleanTime: number;
  error: DeviceError;
}

export class DeviceStatus extends ValueObject<DeviceStatusProps> {
  get mode(): DeviceMode {
    return this.props.mode;
  }

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
      ![
        props.mode,
        props.currentCleanSize,
        props.currentCleanTime,
        props.error,
      ].every(isPresent)
    ) {
      throw new ArgumentNotProvidedException(
        "Missing property in device status constructor"
      );
    }

    if (!Object.values(DEVICE_MODE).includes(props.mode)) {
      throw new ArgumentInvalidException(
        "Invalid property mode in device status constructor"
      );
    }
  }

  static getModeValue({ workMode }: { workMode: number }): DeviceMode {
    if ([0, 1, 5, 10].includes(workMode)) {
      return DEVICE_MODE.NONE;
    }

    if ([30, 31, 32, 35].includes(workMode)) {
      return DEVICE_MODE.ZONE;
    }

    if ([7, 9, 12, 14].includes(workMode)) {
      return DEVICE_MODE.SPOT;
    }

    if ([36, 37, 40].includes(workMode)) {
      return DEVICE_MODE.MOP;
    }

    return DEVICE_MODE.UNKNOWN;
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
