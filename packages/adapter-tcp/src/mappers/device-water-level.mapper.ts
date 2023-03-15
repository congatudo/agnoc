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

export class DeviceWaterLevelMapper implements Mapper<DeviceWaterLevel, number> {
  toDomain(waterLevel: number): DeviceWaterLevel {
    return new DeviceWaterLevel(ROBOT_TO_DOMAIN[waterLevel]);
  }

  fromDomain(waterLevel: DeviceWaterLevel): number {
    return DOMAIN_TO_ROBOT[waterLevel.value];
  }
}
