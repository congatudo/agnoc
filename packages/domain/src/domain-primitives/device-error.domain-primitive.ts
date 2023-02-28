import { ArgumentInvalidException, DomainPrimitive } from '@agnoc/toolkit';

/** Describes a device error value. */
export enum DeviceErrorValue {
  BatteryTemperature = 'BatteryTemperature',
  BrokenCharging = 'BrokenCharging',
  BrokenChargingWait = 'BrokenChargingWait',
  BrokenGoHome = 'BrokenGoHome',
  BumperStruct = 'BumperStruct',
  CheckNetAvailable = 'CheckNetAvailable',
  CliffIrStruct = 'CliffIrStruct',
  DishclothDirty = 'DishclothDirty',
  DockClipException = 'DockClipException',
  DustboxNotExist = 'DustboxNotExist',
  DustBoxFull = 'DustBoxFull',
  EscapeFailed = 'EscapeFailed',
  FolloweIrException = 'FolloweIrException',
  GeomagetismStruct = 'GeomagetismStruct',
  GiveBack = 'GiveBack',
  GlobalAppointClean = 'GlobalAppointClean',
  GoDockFailed = 'GoDockFailed',
  HandppenDustBoxFull = 'HandppenDustBoxFull',
  HuichengheFull = 'HuichengheFull',
  LidarTimeOut = 'LidarTimeOut',
  LowPowerPlanDis = 'LowPowerPlanDis',
  LowStartBattery = 'LowStartBattery',
  MoppingNotExist = 'MoppingNotExist',
  None = 'None',
  PutMachineDock = 'PutMachineDock',
  RelocalizationFailed = 'RelocalizationFailed',
  RobotChangingFinish = 'RobotChangingFinish',
  RobotRelocalitionIng = 'RobotRelocalitionIng',
  RobotRepeatCleaning = 'RobotRepeatCleaning',
  RobotSelfChecking = 'RobotSelfChecking',
  RollBrushStall = 'RollBrushStall',
  SideBrushStall = 'SideBrushStall',
  SlopeStartFailed = 'SlopeStartFailed',
  StartDockFailed = 'StartDockFailed',
  SystemUpgrade = 'SystemUpgrade',
  WaitChargeFinish = 'WaitChargeFinish',
  WaterBoxNotExist = 'WaterBoxNotExist',
  WaterTrunkEmpty = 'WaterTrunkEmpty',
  WheelUp = 'WheelUp',
}

/**
 * Describes a device error value.
 *
 * Allowed values from {@link DeviceErrorValue}.
 */
export class DeviceError extends DomainPrimitive<DeviceErrorValue> {
  protected validate(props: DomainPrimitive<DeviceErrorValue>): void {
    if (!Object.values(DeviceErrorValue).includes(props.value)) {
      throw new ArgumentInvalidException(`Value '${props.value}' for ${this.constructor.name} is invalid`);
    }
  }
}
