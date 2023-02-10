import { Mapper } from '../base-classes/mapper.base';
import { DomainException } from '../exceptions/domain.exception';
import { NotImplementedException } from '../exceptions/not-implemented.exception';
import { DeviceError } from '../value-objects/device-error.value-object';

const ROBOT_TO_DOMAIN = {
  0: DeviceError.VALUE.NONE,
  2003: DeviceError.VALUE.LOW_POWER_PLAN_DIS,
  2100: DeviceError.VALUE.BROKEN_GO_HOME,
  2101: DeviceError.VALUE.NONE,
  2102: DeviceError.VALUE.NONE,
  2103: DeviceError.VALUE.NONE,
  2104: DeviceError.VALUE.NONE,
  2105: DeviceError.VALUE.NONE,
  2106: DeviceError.VALUE.NONE,
  2107: DeviceError.VALUE.GLOBAL_APPOINT_CLEAN,
  2108: DeviceError.VALUE.ROBOT_RELOCALITION_ING,
  2109: DeviceError.VALUE.ROBOT_REPEAT_CLEANING,
  2110: DeviceError.VALUE.ROBOT_SELF_CHECKING,
  2200: DeviceError.VALUE.NONE,
  2203: DeviceError.VALUE.NONE,
  500: DeviceError.VALUE.LIDAR_TIME_OUT,
  501: DeviceError.VALUE.WHEEL_UP,
  502: DeviceError.VALUE.LOW_START_BATTERY,
  503: DeviceError.VALUE.DUSTBOX_NOT_EXIST,
  504: DeviceError.VALUE.GEOMAGETISM_STRUCT,
  505: DeviceError.VALUE.START_DOCK_FAILED,
  506: DeviceError.VALUE.FOLLOWE_IR_EXCEPTION,
  507: DeviceError.VALUE.RELOCALIZATION_FAILED,
  508: DeviceError.VALUE.SLOPE_START_FAILED,
  509: DeviceError.VALUE.CLIFF_IR_STRUCT,
  510: DeviceError.VALUE.BUMPER_STRUCT,
  511: DeviceError.VALUE.GO_DOCK_FAILED,
  512: DeviceError.VALUE.PUT_MACHINE_DOCK,
  513: DeviceError.VALUE.ESCAPE_FAILED,
  514: DeviceError.VALUE.ESCAPE_FAILED,
  515: DeviceError.VALUE.DOCK_CLIP_EXCEPTION,
  516: DeviceError.VALUE.BATTERY_TEMPERATURE,
  517: DeviceError.VALUE.SYSTEM_UPGRADE,
  518: DeviceError.VALUE.WAIT_CHARGE_FINISH,
  519: DeviceError.VALUE.ROLL_BRUSH_STALL,
  520: DeviceError.VALUE.SIDE_BRUSH_STALL,
  521: DeviceError.VALUE.WATER_BOX_NOT_EXIST,
  522: DeviceError.VALUE.MOPPING_NOT_EXIST,
  523: DeviceError.VALUE.HANDPPEN_DUST_BOX_FULL,
  525: DeviceError.VALUE.WATER_TRUNK_EMPTY,
  526: DeviceError.VALUE.DISHCLOTH_DIRTY,
  527: DeviceError.VALUE.DUST_BOX_FULL,
} as const;

export const DeviceErrorMapper: Mapper<DeviceError, number> = class {
  static toDomain(error: number): DeviceError {
    if (!(error in ROBOT_TO_DOMAIN)) {
      throw new DomainException(`Unable to map error code '${error}' to domain value`);
    }

    const value = ROBOT_TO_DOMAIN[error as keyof typeof ROBOT_TO_DOMAIN];

    // @ts-expect-error unknown error
    return new DeviceError({ value });
  }

  static toRobot(): never {
    throw new NotImplementedException('DeviceErrorMapper.toRobot');
  }
};
