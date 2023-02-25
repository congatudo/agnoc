import { ValueObject, ArgumentInvalidException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceError, DeviceErrorValue } from './device-error.value-object';

describe('DeviceError', function () {
  it('should be created', function () {
    const deviceError = new DeviceError({ value: DeviceErrorValue.None });

    expect(deviceError).to.be.instanceOf(ValueObject);
    expect(deviceError.value).to.be.equal(DeviceErrorValue.None);
  });

  it('should throw an error when value is invalid', function () {
    // @ts-expect-error - invalid value
    expect(() => new DeviceError({ value: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for device error is invalid`,
    );
  });
});
