import { ValueObject } from '@agnoc/toolkit';
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
    const keys: (keyof DeviceSettingsProps)[] = [
      'voice',
      'quietHours',
      'ecoMode',
      'repeatClean',
      'brokenClean',
      'carpetMode',
      'historyMap',
    ];

    keys.forEach((prop) => {
      this.validateDefinedProp(props, prop);
    });

    this.validateInstanceProp(props, 'voice', VoiceSetting);
    this.validateInstanceProp(props, 'quietHours', QuietHoursSetting);
    this.validateInstanceProp(props, 'ecoMode', DeviceSetting);
    this.validateInstanceProp(props, 'repeatClean', DeviceSetting);
    this.validateInstanceProp(props, 'brokenClean', DeviceSetting);
    this.validateInstanceProp(props, 'carpetMode', DeviceSetting);
    this.validateInstanceProp(props, 'historyMap', DeviceSetting);
  }
}
