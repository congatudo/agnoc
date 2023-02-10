import { Mapper } from '../base-classes/mapper.base';
import { interpolate } from '../utils/interpolate.util';
import { DeviceBattery } from '../value-objects/device-battery.value-object';

const ROBOT_MAX_VALUE = 200;
const ROBOT_MIN_VALUE = 100;

const ROBOT = {
  min: ROBOT_MIN_VALUE,
  max: ROBOT_MAX_VALUE,
};
const DEVICE = {
  min: DeviceBattery.MIN_VALUE,
  max: DeviceBattery.MAX_VALUE,
};

export const DeviceBatteryMapper: Mapper<DeviceBattery, number> = class {
  static toDomain(battery: number): DeviceBattery {
    if (battery < ROBOT_MIN_VALUE) {
      battery = ROBOT_MIN_VALUE;
    }

    if (battery > ROBOT_MAX_VALUE) {
      battery = ROBOT_MAX_VALUE;
    }

    return new DeviceBattery({
      value: interpolate(battery, ROBOT, DEVICE),
    });
  }

  static toRobot(battery: DeviceBattery): number {
    return Math.floor(interpolate(battery.value, DEVICE, ROBOT));
  }
};
