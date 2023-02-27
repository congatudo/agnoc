import { ArgumentInvalidException, ArgumentNotProvidedException, ValueObject } from '@agnoc/toolkit';
import { expect } from 'chai';
import { CleanSize } from '../primitives/clean-size.value-object';
import { DeviceCleanWork } from './device-clean-work.value-object';
import { DeviceTime } from './device-time.value-object';

describe('DeviceCleanWork', function () {
  let size: CleanSize;
  let time: DeviceTime;

  beforeEach(function () {
    size = new CleanSize(10);
    time = DeviceTime.fromMinutes(120);
  });

  it('should be created', function () {
    const deviceClean = new DeviceCleanWork({ size, time });

    expect(deviceClean).to.be.instanceOf(ValueObject);
    expect(deviceClean.size).to.be.equal(size);
    expect(deviceClean.time).to.be.equal(time);
  });

  it("should throw an error when 'size' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceCleanWork({ time })).to.throw(
      ArgumentNotProvidedException,
      `Property 'size' for device clean not provided`,
    );
  });

  it("should throw an error when 'size' property is invalid", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceCleanWork({ size: 1, time })).to.throw(
      ArgumentInvalidException,
      `Value '1' for property 'size' for device clean is not a clean size`,
    );
  });

  it("should throw an error when 'time' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceCleanWork({ size })).to.throw(
      ArgumentNotProvidedException,
      `Property 'time' for device clean not provided`,
    );
  });

  it("should throw an error when 'time' property is invalid", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceCleanWork({ size, time: 1 })).to.throw(
      ArgumentInvalidException,
      `Value '1' for property 'time' for device clean is not a device time`,
    );
  });
});
