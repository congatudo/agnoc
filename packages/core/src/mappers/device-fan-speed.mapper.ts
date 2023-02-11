import { DeviceFanSpeed } from '@agnoc/domain';
import { flipObject, Mapper } from '@agnoc/toolkit';

const DOMAIN_TO_ROBOT = {
  [DeviceFanSpeed.VALUE.OFF]: 0,
  [DeviceFanSpeed.VALUE.LOW]: 1,
  [DeviceFanSpeed.VALUE.MEDIUM]: 2,
  [DeviceFanSpeed.VALUE.HIGH]: 3,
};

const ROBOT_TO_DOMAIN = flipObject(DOMAIN_TO_ROBOT);

export const DeviceFanSpeedMapper: Mapper<DeviceFanSpeed, number> = class {
  static toDomain(fanSpeed: number): DeviceFanSpeed {
    return new DeviceFanSpeed({
      value: ROBOT_TO_DOMAIN[fanSpeed],
    });
  }

  static fromDomain(fanSpeed: DeviceFanSpeed): number {
    return DOMAIN_TO_ROBOT[fanSpeed.value];
  }
};
