import { Mapper } from '../base-classes/mapper.base';
import { interpolate } from '../utils/interpolate.util';
import { DeviceVoice } from '../value-objects/device-voice.value-object';

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

  static toRobot({ isEnabled, volume }: DeviceVoice): RobotVoice {
    return {
      isEnabled,
      volume: Math.floor(interpolate(volume, DEVICE, ROBOT)),
    };
  }
};
