import { DeviceState, DeviceStateValue } from '@agnoc/domain';
import { DomainException, NotImplementedException } from '@agnoc/toolkit';
import type { Mapper } from '@agnoc/toolkit';

export interface RobotState {
  type: number;
  workMode: number;
  chargeStatus: boolean;
}

/*

Conga 5090 workMode codes, should be compatible with other congas.
+----------+--------------+----------------+
| workMode | ActivityMode |    workMode    |
+----------+--------------+----------------+
|        0 | Auto         | IDLE           |
|        1 | Auto         | CLEANING       |
|        2 | Manual       | MANUAL_CONTROL |
|        4 | Auto         | PAUSED         |
|        5 | Auto         | RETURNING      |
|        7 | Spot         | CLEANING       |
|        9 | Spot         | PAUSED         |
|       12 | Spot         | RETURNING      |
|       14 | Spot         | IDLE           |
|       20 | Spiral       | CLEANING       |
|       23 | Spiral       | IDLE           |
|       25 | Edge         | CLEANING       |
|       26 | Edge         | PAUSED         |
|       27 | Edge         | RETURNING      |
|       29 | Edge         | IDLE           |
|       30 | Area         | CLEANING       |
|       31 | Area         | PAUSED         |
|       32 | Area         | RETURNING      |
|       35 | Area         | IDLE           |
|       36 | Scrubbing    | CLEANING       |
|       37 | Scrubbing    | PAUSED         |
|       38 | Scrubbing    | RETURNING      |
|       40 | Scrubbing    | IDLE           |
+----------+--------------+----------------+

*/

function getDomainValue(state: RobotState): DeviceStateValue {
  const { type, workMode, chargeStatus } = state;

  if (![0, 3].includes(type)) {
    return DeviceStateValue.Error;
  }

  if ([2].includes(workMode)) {
    return DeviceStateValue.ManualControl;
  }

  if ([5, 10, 12, 27, 32, 38].includes(workMode)) {
    return DeviceStateValue.Returning;
  }

  if ([4, 9, 26, 31, 37].includes(workMode)) {
    return DeviceStateValue.Paused;
  }

  if ([1, 6, 7, 11, 20, 25, 30, 36].includes(workMode)) {
    return DeviceStateValue.Cleaning;
  }

  if (chargeStatus) {
    return DeviceStateValue.Docked;
  }

  if ([0, 14, 23, 29, 35, 40].includes(workMode)) {
    return DeviceStateValue.Idle;
  }

  throw new DomainException(`Unable to map device state from data: ${JSON.stringify(state)}`);
}

export class DeviceStateMapper implements Mapper<DeviceState, RobotState> {
  toDomain(state: RobotState): DeviceState {
    return new DeviceState({
      value: getDomainValue(state),
    });
  }

  fromDomain(): RobotState {
    throw new NotImplementedException('DeviceStateMapper.toRobot');
  }
}
