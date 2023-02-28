import { ValueObject, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceTime } from './device-time.value-object';
import { QuietHoursSetting } from './quiet-hours-setting.value-object';

describe('QuietHoursSetting', function () {
  let beginTime: DeviceTime;
  let endTime: DeviceTime;

  beforeEach(function () {
    beginTime = DeviceTime.fromMinutes(120);
    endTime = DeviceTime.fromMinutes(240);
  });

  it('should be created', function () {
    const deviceQuietHours = new QuietHoursSetting({ isEnabled: true, beginTime, endTime });

    expect(deviceQuietHours).to.be.instanceOf(ValueObject);
    expect(deviceQuietHours.isEnabled).to.be.equal(true);
    expect(deviceQuietHours.beginTime).to.be.equal(beginTime);
    expect(deviceQuietHours.endTime).to.be.equal(endTime);
  });

  it("should throw an error when 'isEnabled' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new QuietHoursSetting({ beginTime, endTime })).to.throw(
      ArgumentNotProvidedException,
      `Property 'isEnabled' for QuietHoursSetting not provided`,
    );
  });

  it("should throw an error when 'isEnabled' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new QuietHoursSetting({ isEnabled: 'foo', beginTime, endTime })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'isEnabled' for QuietHoursSetting is not a boolean`,
    );
  });

  it("should throw an error when 'beginTime' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new QuietHoursSetting({ isEnabled: true, endTime })).to.throw(
      ArgumentNotProvidedException,
      `Property 'beginTime' for QuietHoursSetting not provided`,
    );
  });

  it("should throw an error when 'beginTime' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new QuietHoursSetting({ isEnabled: true, beginTime: 'foo', endTime })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'beginTime' for QuietHoursSetting is not a DeviceTime`,
    );
  });

  it("should throw an error when 'endTime' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new QuietHoursSetting({ isEnabled: true, beginTime })).to.throw(
      ArgumentNotProvidedException,
      `Property 'endTime' for QuietHoursSetting not provided`,
    );
  });

  it("should throw an error when 'endTime' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new QuietHoursSetting({ isEnabled: true, beginTime, endTime: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'endTime' for QuietHoursSetting is not a DeviceTime`,
    );
  });
});
