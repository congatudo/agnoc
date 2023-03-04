import { ValueObject } from '@agnoc/toolkit';

/** The properties of the voice setting. */
export interface VoiceSettingProps {
  /** Whether the voice is enabled. */
  isEnabled: boolean;
  /** The volume of the voice. */
  volume: number;
}

/** The minimum volume of the voice. */
export const VoiceSettingMinVolume = 0;

/** The maximum volume of the voice. */
export const VoiceSettingMaxVolume = 100;

/** Describe the voice setting of a device. */
export class VoiceSetting extends ValueObject<VoiceSettingProps> {
  /** Returns if the voice is enabled. */
  get isEnabled(): boolean {
    return this.props.isEnabled;
  }

  /** Returns the volume of the voice. */
  get volume(): number {
    return this.props.volume;
  }

  protected validate(props: VoiceSettingProps): void {
    const keys: (keyof VoiceSettingProps)[] = ['isEnabled', 'volume'];

    keys.forEach((prop) => {
      this.validateDefinedProp(props, prop);
    });

    this.validateTypeProp(props, 'isEnabled', 'boolean');
    this.validateNumberProp(props, 'volume');
    this.validateNumberProp(props, 'volume', { min: VoiceSettingMinVolume, max: VoiceSettingMaxVolume });
  }
}
