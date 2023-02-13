import { DeviceWaterLevel, DeviceWaterLevelValue } from '@agnoc/domain';
import { flipObject } from '@agnoc/toolkit';
import type { Mapper } from '@agnoc/toolkit';

const DOMAIN_TO_ROBOT = {
  [DeviceWaterLevelValue.Off]: 10,
  [DeviceWaterLevelValue.Low]: 11,
  [DeviceWaterLevelValue.Medium]: 12,
  [DeviceWaterLevelValue.High]: 13,
};

const ROBOT_TO_DOMAIN = flipObject(DOMAIN_TO_ROBOT);

export const DeviceWaterLevelMapper: Mapper<DeviceWaterLevel, number> = class {
  static toDomain(waterLevel: number): DeviceWaterLevel {
    return new DeviceWaterLevel({
      value: ROBOT_TO_DOMAIN[waterLevel],
    });
  }

  static fromDomain(waterLevel: DeviceWaterLevel): number {
    return DOMAIN_TO_ROBOT[waterLevel.value];
  }
};
