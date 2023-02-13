import { DeviceFanSpeed, DeviceFanSpeedValue } from '@agnoc/domain';
import { flipObject } from '@agnoc/toolkit';
import type { Mapper } from '@agnoc/toolkit';

const DOMAIN_TO_ROBOT = {
  [DeviceFanSpeedValue.Off]: 0,
  [DeviceFanSpeedValue.Low]: 1,
  [DeviceFanSpeedValue.Medium]: 2,
  [DeviceFanSpeedValue.High]: 3,
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
