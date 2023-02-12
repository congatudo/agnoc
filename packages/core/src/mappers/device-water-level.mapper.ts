import { DeviceWaterLevel } from '@agnoc/domain';
import { flipObject } from '@agnoc/toolkit';
import type { Mapper } from '@agnoc/toolkit';

const DOMAIN_TO_ROBOT = {
  [DeviceWaterLevel.VALUE.OFF]: 10,
  [DeviceWaterLevel.VALUE.LOW]: 11,
  [DeviceWaterLevel.VALUE.MEDIUM]: 12,
  [DeviceWaterLevel.VALUE.HIGH]: 13,
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
