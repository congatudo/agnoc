import {
  ValueObject,
  isPresent,
  ArgumentNotProvidedException,
  ArgumentInvalidException,
  ArgumentOutOfRangeException,
} from '@agnoc/toolkit';

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
    const keys = ['isEnabled', 'volume'] as (keyof VoiceSettingProps)[];

    keys.forEach((prop) => {
      const value = props[prop];

      if (!isPresent(value)) {
        throw new ArgumentNotProvidedException(`Property '${prop}' for voice setting not provided`);
      }
    });

    if (typeof props.isEnabled !== 'boolean') {
      throw new ArgumentInvalidException(
        `Value '${props.isEnabled as string}' for property 'isEnabled' for voice setting is not a boolean`,
      );
    }

    if (typeof props.volume !== 'number') {
      throw new ArgumentInvalidException(
        `Value '${props.volume as string}' for property 'volume' for voice setting is not a number`,
      );
    }

    if (props.volume < VoiceSettingMinVolume || props.volume > VoiceSettingMaxVolume) {
      throw new ArgumentOutOfRangeException(
        `Value '${props.volume}' for property 'volume' for voice setting is out of range`,
      );
    }
  }
}