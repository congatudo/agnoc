import { ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceSetting } from './device-setting.value-object';

describe('DeviceSetting', function () {
  it('should create a device setting', function () {
    const deviceSetting = new DeviceSetting({ isEnabled: true });

    expect(deviceSetting.isEnabled).to.be.true;
  });

  it("should throw an error when 'isEnabled' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceSetting({ foo: 'bar' })).to.throw(
      ArgumentNotProvidedException,
      `Property 'isEnabled' for device setting not provided`,
    );
  });

  it("should throw an error when 'isEnabled' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceSetting({ isEnabled: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'isEnabled' for device setting is not a boolean`,
    );
  });
});
