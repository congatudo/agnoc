import { Mapper } from "../base-classes/mapper.base";
import { DeviceBattery } from "../value-objects/device-battery.value-object";

const ROBOT_MAX_VALUE = 200;

export const DeviceBatteryMapper: Mapper<DeviceBattery, number> = class {
  static toDomain(battery: number): DeviceBattery {
    return new DeviceBattery({
      value: (battery * DeviceBattery.MAX_VALUE) / ROBOT_MAX_VALUE,
    });
  }

  static toRobot(battery: DeviceBattery): number {
    return (battery.value * ROBOT_MAX_VALUE) / DeviceBattery.MAX_VALUE;
  }
};
