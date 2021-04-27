import { Mapper } from "../base-classes/mapper.base";
import { DomainException } from "../exceptions/domain.exception";
import { NotImplementedException } from "../exceptions/not-implemented.exception";
import { ValueOf } from "../types/value-of.type";
import { DeviceState } from "../value-objects/device-state.value-object";

const { VALUE } = DeviceState;

interface RobotState {
  type: number;
  workMode: number;
  chargeStatus: boolean;
}

function getDomainValue(state: RobotState): ValueOf<typeof VALUE> {
  const { type, workMode, chargeStatus } = state;

  if (![0, 3].includes(type) || [11].includes(workMode)) {
    return VALUE.ERROR;
  }

  if ([2].includes(workMode)) {
    return VALUE.MANUAL_CONTROL;
  }

  if (chargeStatus) {
    return VALUE.DOCKED;
  }

  if ([5, 10, 12, 32].includes(workMode)) {
    return VALUE.RETURNING;
  }

  if ([4, 9, 31, 37].includes(workMode)) {
    return VALUE.PAUSED;
  }

  if ([0, 11, 14, 23, 29, 35, 40].includes(workMode)) {
    return VALUE.IDLE;
  }

  if ([1, 6, 7, 25, 20, 30, 36].includes(workMode)) {
    return VALUE.CLEANING;
  }

  throw new DomainException(
    `Unable to map device state from data: ${JSON.stringify(state)}`
  );
}

export const DeviceStateMapper: Mapper<DeviceState, RobotState> = class {
  static toDomain(state: RobotState): DeviceState {
    return new DeviceState({
      value: getDomainValue(state),
    });
  }

  static toRobot(): RobotState {
    throw new NotImplementedException("DeviceStateMapper.toRobot");
  }
};
