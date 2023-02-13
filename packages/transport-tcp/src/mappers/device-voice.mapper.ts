import { DeviceVoice, DeviceVoiceMaxVolume, DeviceVoiceMinVolume } from '@agnoc/domain';
import { interpolate } from '@agnoc/toolkit';
import type { Mapper } from '@agnoc/toolkit';

const ROBOT_MAX_VOLUME = 11;
const ROBOT_MIN_VOLUME = 1;

const ROBOT = {
  min: ROBOT_MIN_VOLUME,
  max: ROBOT_MAX_VOLUME,
};
const DEVICE = {
  min: DeviceVoiceMinVolume,
  max: DeviceVoiceMaxVolume,
};

export interface RobotVoice {
  isEnabled: boolean;
  volume: number;
}

export const DeviceVoiceMapper: Mapper<DeviceVoice, RobotVoice> = class {
  static toDomain({ isEnabled, volume }: RobotVoice): DeviceVoice {
    return new DeviceVoice({
      isEnabled,
      volume: interpolate(volume, ROBOT, DEVICE),
    });
  }

  static fromDomain({ isEnabled, volume }: DeviceVoice): RobotVoice {
    return {
      isEnabled,
      volume: Math.floor(interpolate(volume, DEVICE, ROBOT)),
    };
  }
};
