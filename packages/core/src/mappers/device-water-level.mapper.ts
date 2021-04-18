import { Mapper } from "../base-classes/mapper.base";
import { flipObject } from "../utils/flip-object.util";
import { DeviceWaterLevel } from "../value-objects/device-water-level.value-object";

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

  static toRobot(waterLevel: DeviceWaterLevel): number {
    return DOMAIN_TO_ROBOT[waterLevel.value];
  }
};
