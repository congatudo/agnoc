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

// TODO: add nullable fields here to prevent casting from consumer
export interface RobotVoice {
  isEnabled: boolean;
  volume: number;
}

export class DeviceVoiceMapper implements Mapper<VoiceSetting, RobotVoice> {
  toDomain({ isEnabled, volume }: RobotVoice): VoiceSetting {
    return new VoiceSetting({
      isEnabled,
      volume: interpolate(volume, ROBOT, DEVICE),
    });
  }

  fromDomain({ isEnabled, volume }: VoiceSetting): RobotVoice {
    return {
      isEnabled,
      volume: Math.floor(interpolate(volume, DEVICE, ROBOT)),
    };
  }
}
