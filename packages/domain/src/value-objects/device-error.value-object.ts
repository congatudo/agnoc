import { ValueObject, isPresent, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
import type { DomainPrimitive } from '@agnoc/toolkit';

export enum DeviceErrorValue {
  BatteryTemperature = 'battery_temperature',
  BrokenCharging = 'broken_charging',
  BrokenChargingWait = 'broken_charging_wait',
  BrokenGoHome = 'broken_go_home',
  BumperStruct = 'bumper_struct',
  CheckNetAvailable = 'check_net_available',
  CliffIrStruct = 'cliff_ir_struct',
  DishclothDirty = 'dishcloth_dirty',
  DockClipException = 'dock_clip_exception',
  DustboxNotExist = 'dustbox_not_exist',
  DustBoxFull = 'dust_box_full',
  EscapeFailed = 'escape_failed',
  FolloweIrException = 'followe_ir_exception',
  GeomagetismStruct = 'geomagetism_struct',
  GiveBack = 'give_back',
  GlobalAppointClean = 'global_appoint_clean',
  GoDockFailed = 'go_dock_failed',
  HandppenDustBoxFull = 'handppen_dust_box_full',
  HuichengheFull = 'huichenghe_full',
  LidarTimeOut = 'lidar_time_out',
  LowPowerPlanDis = 'low_power_plan_dis',
  LowStartBattery = 'low_start_battery',
  MoppingNotExist = 'mopping_not_exist',
  None = 'none',
  PutMachineDock = 'put_machine_dock',
  RelocalizationFailed = 'relocalization_failed',
  RobotChangingFinish = 'robot_changing_finish',
  RobotRelocalitionIng = 'robot_relocalition_ing',
  RobotRepeatCleaning = 'robot_repeat_cleaning',
  RobotSelfChecking = 'robot_self_checking',
  RollBrushStall = 'roll_brush_stall',
  SideBrushStall = 'side_brush_stall',
  SlopeStartFailed = 'slope_start_failed',
  StartDockFailed = 'start_dock_failed',
  SystemUpgrade = 'system_upgrade',
  WaitChargeFinish = 'wait_charge_finish',
  WaterBoxNotExist = 'water_box_not_exist',
  WaterTrunkEmpty = 'water_trunk_empty',
  WheelUp = 'wheel_up',
}

export class DeviceError extends ValueObject<DeviceErrorValue> {
  get value(): DeviceErrorValue {
    return this.props.value;
  }

  protected validate(props: DomainPrimitive<DeviceErrorValue>): void {
    if (![props.value].every(isPresent)) {
      throw new ArgumentNotProvidedException('Missing property in device error constructor');
    }

    if (!Object.values(DeviceErrorValue).includes(props.value)) {
      throw new ArgumentInvalidException('Invalid property in device error constructor');
    }
  }
}
