import { ValueObject, isPresent, ArgumentInvalidException, ArgumentNotProvidedException } from '@agnoc/toolkit';
import { DeviceSetting } from './device-setting.value-object';
import { QuietHoursSetting } from './quiet-hours-setting.value-object';
import { VoiceSetting } from './voice-setting.value-object';

/** The properties of the device settings. */
export interface DeviceSettingsProps {
  /** The voice setting. */
  voice: VoiceSetting;
  /** The quiet hours setting. */
  quietHours: QuietHoursSetting;
  /** The eco mode setting. */
  ecoMode: DeviceSetting;
  /** The repeat clean setting. */
  repeatClean: DeviceSetting;
  /** The broken clean setting. */
  brokenClean: DeviceSetting;
  /** The carpet mode setting. */
  carpetMode: DeviceSetting;
  /** The history map setting. */
  historyMap: DeviceSetting;
}

/** Describe the settings of a device. */
export class DeviceSettings extends ValueObject<DeviceSettingsProps> {
  /** Returns the voice setting. */
  get voice(): VoiceSetting {
    return this.props.voice;
  }

  /** Returns the quiet hours setting. */
  get quietHours(): QuietHoursSetting {
    return this.props.quietHours;
  }

  /** Returns the eco mode setting. */
  get ecoMode(): DeviceSetting {
    return this.props.ecoMode;
  }

  /** Returns the repeat clean setting. */
  get repeatClean(): DeviceSetting {
    return this.props.repeatClean;
  }

  /** Returns the broken clean setting. */
  get brokenClean(): DeviceSetting {
    return this.props.brokenClean;
  }

  /** Returns the carpet mode setting. */
  get carpetMode(): DeviceSetting {
    return this.props.carpetMode;
  }

  /** Returns the history map setting. */
  get historyMap(): DeviceSetting {
    return this.props.historyMap;
  }

  protected validate(props: DeviceSettingsProps): void {
    const keys = [
      'voice',
      'quietHours',
      'ecoMode',
      'repeatClean',
      'brokenClean',
      'carpetMode',
      'historyMap',
    ] as (keyof DeviceSettingsProps)[];

    keys.forEach((prop) => {
      if (!isPresent(props[prop])) {
        throw new ArgumentNotProvidedException(`Property '${prop}' for device settings not provided`);
      }
    });

    if (!(props.voice instanceof VoiceSetting)) {
      throw new ArgumentInvalidException(
        `Value '${props.voice as string}' for property 'voice' for device settings is not a voice setting`,
      );
    }

    if (!(props.quietHours instanceof QuietHoursSetting)) {
      throw new ArgumentInvalidException(
        `Value '${
          props.quietHours as string
        }' for property 'quietHours' for device settings is not a quiet hours setting`,
      );
    }

    if (!(props.ecoMode instanceof DeviceSetting)) {
      throw new ArgumentInvalidException(
        `Value '${props.ecoMode as string}' for property 'ecoMode' for device settings is not a device setting`,
      );
    }

    if (!(props.repeatClean instanceof DeviceSetting)) {
      throw new ArgumentInvalidException(
        `Value '${props.repeatClean as string}' for property 'repeatClean' for device settings is not a device setting`,
      );
    }

    if (!(props.brokenClean instanceof DeviceSetting)) {
      throw new ArgumentInvalidException(
        `Value '${props.brokenClean as string}' for property 'brokenClean' for device settings is not a device setting`,
      );
    }

    if (!(props.carpetMode instanceof DeviceSetting)) {
      throw new ArgumentInvalidException(
        `Value '${props.carpetMode as string}' for property 'carpetMode' for device settings is not a device setting`,
      );
    }

    if (!(props.historyMap instanceof DeviceSetting)) {
      throw new ArgumentInvalidException(
        `Value '${props.historyMap as string}' for property 'historyMap' for device settings is not a device setting`,
      );
    }
  }
}