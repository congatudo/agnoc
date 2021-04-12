import { ValueObject } from "../base-classes/value-object.base";
import { ArgumentInvalidException } from "../exceptions/argument-invalid.exception";
import { ArgumentNotProvidedException } from "../exceptions/argument-not-provided.exception";
import { isPresent } from "../utils/is-present.util";

export const DEVICE_STATE = {
  ERROR: "error",
  DOCKED: "docked",
  IDLE: "idle",
  RETURNING: "returning",
  CLEANING: "cleaning",
  PAUSED: "paused",
  MANUAL_CONTROL: "manual_control",
  MOVING: "moving",
  UNKNOWN: "unknown",
} as const;

export type DeviceState = typeof DEVICE_STATE[keyof typeof DEVICE_STATE];

export const DEVICE_MODE = {
  NONE: "none",
  SPOT: "spot",
  ZONE: "zone",
  UNKNOWN: "unknown",
} as const;

export type DeviceMode = typeof DEVICE_MODE[keyof typeof DEVICE_MODE];

export enum FAN_SPEED {
  "off",
  "low",
  "medium",
  "high",
}

export type FanSpeed = keyof typeof FAN_SPEED;

export const DEVICE_ERROR = {
  NO_DEPOSIT: "no_deposit",
  NO_GROUND: "no_ground",
  UNKNOWN: "unknown",
} as const;

export type DeviceError = typeof DEVICE_ERROR[keyof typeof DEVICE_ERROR];

export interface DeviceStatusProps {
  battery: number;
  state: DeviceState;
  mode: DeviceMode;
  fanSpeed: FanSpeed;
  currentCleanSize: number;
  currentCleanTime: number;
  error: DeviceError;
}

export class DeviceStatus extends ValueObject<DeviceStatusProps> {
  get battery(): number {
    return this.props.battery;
  }

  get state(): DeviceState {
    return this.props.state;
  }

  get mode(): DeviceMode {
    return this.props.mode;
  }

  get fanSpeed(): FanSpeed {
    return this.props.fanSpeed;
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
        props.battery,
        props.state,
        props.mode,
        props.fanSpeed,
        props.currentCleanSize,
        props.currentCleanTime,
      ].map(isPresent)
    ) {
      throw new ArgumentNotProvidedException(
        "Missing property in device status constructor"
      );
    }

    if (props.battery < 0 || props.battery > 100) {
      throw new ArgumentInvalidException(
        "Invalid property battery in device status constructor"
      );
    }

    if (!Object.values(DEVICE_STATE).includes(props.state)) {
      throw new ArgumentInvalidException(
        "Invalid property state in device status constructor"
      );
    }

    if (!Object.values(DEVICE_MODE).includes(props.mode)) {
      throw new ArgumentInvalidException(
        "Invalid property mode in device status constructor"
      );
    }

    if (!Object.keys(FAN_SPEED).includes(props.fanSpeed)) {
      throw new ArgumentInvalidException(
        "Invalid property fanSpeed in device status constructor"
      );
    }
  }

  static getBatteryValue({ battery }: { battery: number }): number {
    const batteryMaxValue = 200;

    return (battery * 100) / batteryMaxValue;
  }

  static getStateValue({
    type,
    workMode,
    chargeStatus,
  }: {
    type: number;
    workMode: number;
    chargeStatus: boolean;
  }): DeviceState {
    if (![0, 3].includes(type) || [11].includes(workMode)) {
      return DEVICE_STATE.ERROR;
    }

    if ([2].includes(workMode)) {
      return DEVICE_STATE.MANUAL_CONTROL;
    }

    if (chargeStatus) {
      return DEVICE_STATE.DOCKED;
    }

    if ([5, 10, 12, 32].includes(workMode)) {
      return DEVICE_STATE.RETURNING;
    }

    if ([4, 9, 31].includes(workMode)) {
      return DEVICE_STATE.PAUSED;
    }

    if ([0, 14, 23, 29, 35].includes(workMode)) {
      return DEVICE_STATE.IDLE;
    }

    if ([1, 6, 7, 25, 20, 30].includes(workMode)) {
      return DEVICE_STATE.CLEANING;
    }

    return DEVICE_STATE.UNKNOWN;
  }

  static getModeValue({ workMode }: { workMode: number }): DeviceMode {
    if ([0, 5, 10].includes(workMode)) {
      return DEVICE_MODE.NONE;
    }

    if ([30, 32, 35].includes(workMode)) {
      return DEVICE_MODE.ZONE;
    }

    if ([7, 12, 14].includes(workMode)) {
      return DEVICE_MODE.SPOT;
    }

    return DEVICE_MODE.UNKNOWN;
  }

  static getFanSpeedValue({
    cleanPreference,
  }: {
    cleanPreference: number;
  }): FanSpeed {
    // eslint-disable-next-line security/detect-object-injection
    return FAN_SPEED[cleanPreference] as FanSpeed;
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
