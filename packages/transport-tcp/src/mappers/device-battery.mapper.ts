import { DeviceBattery, DeviceBatteryMaxValue, DeviceBatteryMinValue } from '@agnoc/domain';
import { interpolate } from '@agnoc/toolkit';
import type { Mapper } from '@agnoc/toolkit';

const ROBOT_MAX_VALUE = 200;
const ROBOT_MIN_VALUE = 100;

const ROBOT = {
  min: ROBOT_MIN_VALUE,
  max: ROBOT_MAX_VALUE,
};
const DEVICE = {
  min: DeviceBatteryMinValue,
  max: DeviceBatteryMaxValue,
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

  static fromDomain(battery: DeviceBattery): number {
    return Math.floor(interpolate(battery.value, DEVICE, ROBOT));
  }
};
