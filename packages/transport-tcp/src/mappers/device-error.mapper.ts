import { DeviceError, DeviceErrorValue } from '@agnoc/domain';
import { DomainException, NotImplementedException } from '@agnoc/toolkit';
import type { Mapper } from '@agnoc/toolkit';

const ROBOT_TO_DOMAIN = {
  0: DeviceErrorValue.None,
  2003: DeviceErrorValue.LowPowerPlanDis,
  2100: DeviceErrorValue.BrokenGoHome,
  2101: DeviceErrorValue.None,
  2102: DeviceErrorValue.None,
  2103: DeviceErrorValue.None,
  2104: DeviceErrorValue.None,
  2105: DeviceErrorValue.None,
  2106: DeviceErrorValue.None,
  2107: DeviceErrorValue.GlobalAppointClean,
  2108: DeviceErrorValue.RobotRelocalitionIng,
  2109: DeviceErrorValue.RobotRepeatCleaning,
  2110: DeviceErrorValue.RobotSelfChecking,
  2200: DeviceErrorValue.None,
  2203: DeviceErrorValue.None,
  500: DeviceErrorValue.LidarTimeOut,
  501: DeviceErrorValue.WheelUp,
  502: DeviceErrorValue.LowStartBattery,
  503: DeviceErrorValue.DustboxNotExist,
  504: DeviceErrorValue.GeomagetismStruct,
  505: DeviceErrorValue.StartDockFailed,
  506: DeviceErrorValue.FolloweIrException,
  507: DeviceErrorValue.RelocalizationFailed,
  508: DeviceErrorValue.SlopeStartFailed,
  509: DeviceErrorValue.CliffIrStruct,
  510: DeviceErrorValue.BumperStruct,
  511: DeviceErrorValue.GoDockFailed,
  512: DeviceErrorValue.PutMachineDock,
  513: DeviceErrorValue.EscapeFailed,
  514: DeviceErrorValue.EscapeFailed,
  515: DeviceErrorValue.DockClipException,
  516: DeviceErrorValue.BatteryTemperature,
  517: DeviceErrorValue.SystemUpgrade,
  518: DeviceErrorValue.WaitChargeFinish,
  519: DeviceErrorValue.RollBrushStall,
  520: DeviceErrorValue.SideBrushStall,
  521: DeviceErrorValue.WaterBoxNotExist,
  522: DeviceErrorValue.MoppingNotExist,
  523: DeviceErrorValue.HandppenDustBoxFull,
  525: DeviceErrorValue.WaterTrunkEmpty,
  526: DeviceErrorValue.DishclothDirty,
  527: DeviceErrorValue.DustBoxFull,
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

  static fromDomain(): never {
    throw new NotImplementedException('DeviceErrorMapper.toRobot');
  }
};
