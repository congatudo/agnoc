import {
  ValueObject,
  ArgumentNotProvidedException,
  ArgumentOutOfRangeException,
  ArgumentInvalidException,
} from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceTime } from './device-time.value-object';

describe('DeviceTime', function () {
  it('should be created', function () {
    const deviceTime = new DeviceTime({ hours: 1, minutes: 30 });

    expect(deviceTime).to.be.instanceOf(ValueObject);
    expect(deviceTime.hours).to.be.equal(1);
    expect(deviceTime.minutes).to.be.equal(30);
  });

  it("should throw an error when 'hours' are not provided", function () {
    // @ts-expect-error - missing hour
    expect(() => new DeviceTime({ minutes: 30 })).to.throw(
      ArgumentNotProvidedException,
      `Property 'hours' for device time not provided`,
    );
  });

  it("should throw an error when 'hours' are invalid", function () {
    // @ts-expect-error - missing hour
    expect(() => new DeviceTime({ hours: 'foo', minutes: 30 })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'hours' for device time is not a number`,
    );
  });

  it("should throw an error when 'hours' are out of range", function () {
    expect(() => new DeviceTime({ hours: 25, minutes: 30 })).to.throw(
      ArgumentOutOfRangeException,
      `Value '25' for property 'hours' for device time is out of range`,
    );
  });

  it("should throw an error when 'minutes' are not provided", function () {
    // @ts-expect-error - missing hour
    expect(() => new DeviceTime({ minutes: 30 })).to.throw(
      ArgumentNotProvidedException,
      `Property 'hours' for device time not provided`,
    );
  });

  it("should throw an error when 'minutes' are invalid", function () {
    // @ts-expect-error - missing hour
    expect(() => new DeviceTime({ hours: 1, minutes: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'minutes' for device time is not a number`,
    );
  });

  it("should throw an error when 'minutes' are out of range", function () {
    expect(() => new DeviceTime({ hours: 1, minutes: 65 })).to.throw(
      ArgumentOutOfRangeException,
      `Value '65' for property 'minutes' for device time is out of range`,
    );
  });

  describe('#toMinutes', function () {
    it('should return minutes from device time', function () {
      const deviceTime = new DeviceTime({ hours: 1, minutes: 30 });

      expect(deviceTime.toMinutes()).to.be.equal(90);
    });
  });

  describe('#fromMinutes', function () {
    it('should be created', function () {
      const deviceTime = DeviceTime.fromMinutes(90);

      expect(deviceTime.hours).to.be.equal(1);
      expect(deviceTime.minutes).to.be.equal(30);
    });
  });
});
