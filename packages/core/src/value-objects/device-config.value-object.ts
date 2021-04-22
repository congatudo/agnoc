import { ValueObject } from "../base-classes/value-object.base";
import { ArgumentInvalidException } from "../exceptions/argument-invalid.exception";
import { ArgumentNotProvidedException } from "../exceptions/argument-not-provided.exception";
import { isPresent } from "../utils/is-present.util";
import { DeviceQuietHours } from "./device-quiet-hours.value-object";

export interface Voice {
  isEnabled: boolean;
  volume: number;
}

export interface DeviceConfigProps {
  voice: Voice;
  quietHours: DeviceQuietHours;
  isEcoModeEnabled: boolean;
  isRepeatCleanEnabled: boolean;
  isBrokenCleanEnabled: boolean;
  isCarpetModeEnabled: boolean;
  isHistoryMapEnabled: boolean;
}

export class DeviceConfig extends ValueObject<DeviceConfigProps> {
  get voice(): Voice {
    return this.props.voice;
  }

  get quietHours(): DeviceQuietHours {
    return this.props.quietHours;
  }

  get isEcoModeEnabled(): boolean {
    return this.props.isEcoModeEnabled;
  }

  get isRepeatCleanEnabled(): boolean {
    return this.props.isRepeatCleanEnabled;
  }

  get isBrokenCleanEnabled(): boolean {
    return this.props.isBrokenCleanEnabled;
  }

  get isCarpetModeEnabled(): boolean {
    return this.props.isCarpetModeEnabled;
  }

  get isHistoryMapEnabled(): boolean {
    return this.props.isHistoryMapEnabled;
  }

  updateCarpetMode(enable: boolean): void {
    this.props.isCarpetModeEnabled = enable;
  }

  updateQuietHours(quietHours: DeviceQuietHours): void {
    this.props.quietHours = quietHours;
  }

  updateHistoryMap(enable: boolean): void {
    this.props.isHistoryMapEnabled = enable;
  }

  protected validate(props: DeviceConfigProps): void {
    if (
      ![
        props.voice.isEnabled,
        props.voice.volume,
        props.quietHours,
        props.isEcoModeEnabled,
        props.isRepeatCleanEnabled,
        props.isBrokenCleanEnabled,
        props.isCarpetModeEnabled,
        props.isHistoryMapEnabled,
        props.isBrokenCleanEnabled,
        props.isCarpetModeEnabled,
        props.isHistoryMapEnabled,
      ].every(isPresent)
    ) {
      throw new ArgumentNotProvidedException(
        "Missing property in device config constructor"
      );
    }

    if (!(props.quietHours instanceof DeviceQuietHours)) {
      throw new ArgumentInvalidException(
        "Invalid property quiet hours in device config constructor"
      );
    }
  }
}
