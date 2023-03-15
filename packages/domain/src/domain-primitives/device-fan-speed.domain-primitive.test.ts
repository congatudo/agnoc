import { ArgumentInvalidException, DomainPrimitive } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceFanSpeed, DeviceFanSpeedValue } from './device-fan-speed.domain-primitive';

describe('DeviceFanSpeed', function () {
  it('should be created', function () {
    const deviceFanSpeed = new DeviceFanSpeed(DeviceFanSpeedValue.Off);

    expect(deviceFanSpeed).to.be.instanceOf(DomainPrimitive);
    expect(deviceFanSpeed.value).to.be.equal(DeviceFanSpeedValue.Off);
  });

  it('should throw an error when value is invalid', function () {
    // @ts-expect-error - invalid value
    expect(() => new DeviceFanSpeed('foo')).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'value' of DeviceFanSpeed is invalid`,
    );
  });
});
