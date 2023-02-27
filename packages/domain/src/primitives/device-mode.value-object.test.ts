import { ArgumentInvalidException, DomainPrimitive } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceMode, DeviceModeValue } from './device-mode.value-object';

describe('DeviceMode', function () {
  it('should be created', function () {
    const deviceMode = new DeviceMode(DeviceModeValue.None);

    expect(deviceMode).to.be.instanceOf(DomainPrimitive);
    expect(deviceMode.value).to.be.equal(DeviceModeValue.None);
  });

  it('should throw an error when value is invalid', function () {
    // @ts-expect-error - invalid value
    expect(() => new DeviceMode({ value: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for device mode is invalid`,
    );
  });
});
