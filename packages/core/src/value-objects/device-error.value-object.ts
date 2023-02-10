import { DomainPrimitive, ValueObject } from '../base-classes/value-object.base';
import { ArgumentInvalidException } from '../exceptions/argument-invalid.exception';
import { ArgumentNotProvidedException } from '../exceptions/argument-not-provided.exception';
import { ValueOf } from '../types/value-of.type';
import { isPresent } from '../utils/is-present.util';

const VALUE = {
  BATTERY_TEMPERATURE: 'battery_temperature',
  BROKEN_CHARGING: 'broken_charging',
  BROKEN_CHARGING_WAIT: 'broken_charging_wait',
  BROKEN_GO_HOME: 'broken_go_home',
  BUMPER_STRUCT: 'bumper_struct',
  CHECK_NET_AVAILABLE: 'check_net_available',
  CLIFF_IR_STRUCT: 'cliff_ir_struct',
  DISHCLOTH_DIRTY: 'dishcloth_dirty',
  DOCK_CLIP_EXCEPTION: 'dock_clip_exception',
  DUSTBOX_NOT_EXIST: 'dustbox_not_exist',
  DUST_BOX_FULL: 'dust_box_full',
  ESCAPE_FAILED: 'escape_failed',
  FOLLOWE_IR_EXCEPTION: 'followe_ir_exception',
  GEOMAGETISM_STRUCT: 'geomagetism_struct',
  GIVE_BACK: 'give_back',
  GLOBAL_APPOINT_CLEAN: 'global_appoint_clean',
  GO_DOCK_FAILED: 'go_dock_failed',
  HANDPPEN_DUST_BOX_FULL: 'handppen_dust_box_full',
  HUICHENGHE_FULL: 'huichenghe_full',
  LIDAR_TIME_OUT: 'lidar_time_out',
  LOW_POWER_PLAN_DIS: 'low_power_plan_dis',
  LOW_START_BATTERY: 'low_start_battery',
  MOPPING_NOT_EXIST: 'mopping_not_exist',
  NONE: 'none',
  PUT_MACHINE_DOCK: 'put_machine_dock',
  RELOCALIZATION_FAILED: 'relocalization_failed',
  ROBOT_CHANGING_FINISH: 'robot_changing_finish',
  ROBOT_RELOCALITION_ING: 'robot_relocalition_ing',
  ROBOT_REPEAT_CLEANING: 'robot_repeat_cleaning',
  ROBOT_SELF_CHECKING: 'robot_self_checking',
  ROLL_BRUSH_STALL: 'roll_brush_stall',
  SIDE_BRUSH_STALL: 'side_brush_stall',
  SLOPE_START_FAILED: 'slope_start_failed',
  START_DOCK_FAILED: 'start_dock_failed',
  SYSTEM_UPGRADE: 'system_upgrade',
  WAIT_CHARGE_FINISH: 'wait_charge_finish',
  WATER_BOX_NOT_EXIST: 'water_box_not_exist',
  WATER_TRUNK_EMPTY: 'water_trunk_empty',
  WHEEL_UP: 'wheel_up',
} as const;

type Value = ValueOf<typeof VALUE>;

export class DeviceError extends ValueObject<Value> {
  get value(): Value {
    return this.props.value;
  }

  protected validate(props: DomainPrimitive<Value>): void {
    if (![props.value].every(isPresent)) {
      throw new ArgumentNotProvidedException('Missing property in device error constructor');
    }

    if (!Object.values(VALUE).includes(props.value)) {
      throw new ArgumentInvalidException('Invalid property in device error constructor');
    }
  }

  static VALUE = VALUE;
}
