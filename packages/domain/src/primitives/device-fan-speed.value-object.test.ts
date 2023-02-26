import { ValueObject, ArgumentInvalidException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceFanSpeed, DeviceFanSpeedValue } from './device-fan-speed.value-object';

describe('DeviceFanSpeed', function () {
  it('should be created', function () {
    const deviceFanSpeed = new DeviceFanSpeed({ value: DeviceFanSpeedValue.Off });

    expect(deviceFanSpeed).to.be.instanceOf(ValueObject);
    expect(deviceFanSpeed.value).to.be.equal(DeviceFanSpeedValue.Off);
  });

  it('should throw an error when value is invalid', function () {
    // @ts-expect-error - invalid value
    expect(() => new DeviceFanSpeed({ value: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for device fan speed is invalid`,
    );
  });
});
