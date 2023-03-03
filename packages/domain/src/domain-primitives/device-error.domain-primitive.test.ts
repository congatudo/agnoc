import { ValueObject, ArgumentInvalidException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceError, DeviceErrorValue } from './device-error.domain-primitive';

describe('DeviceError', function () {
  it('should be created', function () {
    const deviceError = new DeviceError(DeviceErrorValue.None);

    expect(deviceError).to.be.instanceOf(ValueObject);
    expect(deviceError.value).to.be.equal(DeviceErrorValue.None);
  });

  it('should throw an error when value is invalid', function () {
    // @ts-expect-error - invalid value
    expect(() => new DeviceError('foo')).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'value' of DeviceError is not one of 'BatteryTemperature, BrokenCharging, BrokenChargingWait, BrokenGoHome, BumperStruct, CheckNetAvailable, CliffIrStruct, DishclothDirty, DockClipException, DustboxNotExist, DustBoxFull, EscapeFailed, FolloweIrException, GeomagetismStruct, GiveBack, GlobalAppointClean, GoDockFailed, HandppenDustBoxFull, HuichengheFull, LidarTimeOut, LowPowerPlanDis, LowStartBattery, MoppingNotExist, None, PutMachineDock, RelocalizationFailed, RobotChangingFinish, RobotRelocalitionIng, RobotRepeatCleaning, RobotSelfChecking, RollBrushStall, SideBrushStall, SlopeStartFailed, StartDockFailed, SystemUpgrade, WaitChargeFinish, WaterBoxNotExist, WaterTrunkEmpty, WheelUp'`,
    );
  });
});
