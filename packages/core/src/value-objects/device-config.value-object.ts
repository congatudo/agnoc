import { ValueObject } from "../base-classes/value-object.base";
import { ArgumentNotProvidedException } from "../exceptions/argument-not-provided.exception";
import { isPresent } from "../utils/is-present.util";

interface QuietHoursTime {
  hour: number;
  minute: number;
}

interface QuietHours {
  isEnabled: boolean;
  begin: QuietHoursTime;
  end: QuietHoursTime;
}

interface Voice {
  isEnabled: boolean;
  volume: number;
}

export interface DeviceConfigProps {
  voice: Voice;
  quietHours: QuietHours;
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

  get quietHours(): QuietHours {
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

  protected validate(props: DeviceConfigProps): void {
    if (
      ![
        props.voice.isEnabled,
        props.voice.volume,
        props.quietHours.isEnabled,
        props.quietHours.begin.hour,
        props.quietHours.begin.minute,
        props.quietHours.end.hour,
        props.quietHours.end.minute,
        props.isEcoModeEnabled,
        props.isRepeatCleanEnabled,
        props.isBrokenCleanEnabled,
        props.isCarpetModeEnabled,
        props.isHistoryMapEnabled,
      ].map(isPresent)
    ) {
      throw new ArgumentNotProvidedException(
        "Missing property in device config constructor"
      );
    }
  }
}
