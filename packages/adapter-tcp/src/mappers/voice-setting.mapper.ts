import { VoiceSetting, VoiceSettingMaxVolume, VoiceSettingMinVolume } from '@agnoc/domain';
import { interpolate } from '@agnoc/toolkit';
import type { Mapper } from '@agnoc/toolkit';

const ROBOT_MAX_VOLUME = 11;
const ROBOT_MIN_VOLUME = 1;

const ROBOT = {
  min: ROBOT_MIN_VOLUME,
  max: ROBOT_MAX_VOLUME,
};
const DEVICE = {
  min: VoiceSettingMinVolume,
  max: VoiceSettingMaxVolume,
};

export interface RobotVoice {
  isEnabled: boolean | null | undefined;
  volume: number | null | undefined;
}

export class VoiceSettingMapper implements Mapper<VoiceSetting, RobotVoice> {
  toDomain({ isEnabled, volume }: RobotVoice): VoiceSetting {
    return new VoiceSetting({
      isEnabled: isEnabled ?? false,
      volume: interpolate(volume ?? ROBOT_MIN_VOLUME, ROBOT, DEVICE),
    });
  }

  fromDomain({ isEnabled, volume }: VoiceSetting): RobotVoice {
    return {
      isEnabled,
      volume: Math.floor(interpolate(volume, DEVICE, ROBOT)),
    };
  }
}
