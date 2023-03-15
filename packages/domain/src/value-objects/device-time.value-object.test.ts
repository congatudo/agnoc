import {
  ValueObject,
  ArgumentNotProvidedException,
  ArgumentOutOfRangeException,
  ArgumentInvalidException,
} from '@agnoc/toolkit';
import { expect } from 'chai';
import { givenSomeDeviceTimeProps } from '../test-support';
import { DeviceTime } from './device-time.value-object';

describe('DeviceTime', function () {
  it('should be created', function () {
    const deviceTimeProps = givenSomeDeviceTimeProps();
    const deviceTime = new DeviceTime(deviceTimeProps);

    expect(deviceTime).to.be.instanceOf(ValueObject);
    expect(deviceTime.hours).to.be.equal(deviceTimeProps.hours);
    expect(deviceTime.minutes).to.be.equal(deviceTimeProps.minutes);
  });

  it("should throw an error when 'hours' are not provided", function () {
    // @ts-expect-error - missing hour
    expect(() => new DeviceTime({ ...givenSomeDeviceTimeProps(), hours: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'hours' for DeviceTime not provided`,
    );
  });

  it("should throw an error when 'hours' are invalid", function () {
    // @ts-expect-error - missing hour
    expect(() => new DeviceTime({ ...givenSomeDeviceTimeProps(), hours: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'hours' of DeviceTime is not a number`,
    );
  });

  it("should throw an error when 'hours' are out of range", function () {
    expect(() => new DeviceTime({ ...givenSomeDeviceTimeProps(), hours: 25 })).to.throw(
      ArgumentOutOfRangeException,
      `Value '25' for property 'hours' of DeviceTime is out of range [0, 23]`,
    );
  });

  it("should throw an error when 'minutes' are not provided", function () {
    // @ts-expect-error - missing hour
    expect(() => new DeviceTime({ ...givenSomeDeviceTimeProps(), minutes: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'minutes' for DeviceTime not provided`,
    );
  });

  it("should throw an error when 'minutes' are invalid", function () {
    // @ts-expect-error - missing hour
    expect(() => new DeviceTime({ ...givenSomeDeviceTimeProps(), minutes: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'minutes' of DeviceTime is not a number`,
    );
  });

  it("should throw an error when 'minutes' are out of range", function () {
    expect(() => new DeviceTime({ ...givenSomeDeviceTimeProps(), minutes: 65 })).to.throw(
      ArgumentOutOfRangeException,
      `Value '65' for property 'minutes' of DeviceTime is out of range [0, 59]`,
    );
  });

  describe('#toMinutes', function () {
    it('should return minutes from DeviceTime', function () {
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
