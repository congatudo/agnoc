import { DeviceVoice } from '@agnoc/domain';
import { Mapper, interpolate } from '@agnoc/toolkit';

const ROBOT_MAX_VOLUME = 11;
const ROBOT_MIN_VOLUME = 1;

const ROBOT = {
  min: ROBOT_MIN_VOLUME,
  max: ROBOT_MAX_VOLUME,
};
const DEVICE = {
  min: DeviceVoice.MIN_VOLUME,
  max: DeviceVoice.MAX_VOLUME,
};

interface RobotVoice {
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
