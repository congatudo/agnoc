import { ArgumentInvalidException, ArgumentNotProvidedException, ValueObject } from '@agnoc/toolkit';
import { expect } from 'chai';
import { givenSomeDeviceCleanWorkProps } from '../test-support';
import { DeviceCleanWork } from './device-clean-work.value-object';

describe('DeviceCleanWork', function () {
  it('should be created', function () {
    const deviceCleanWorkProps = givenSomeDeviceCleanWorkProps();
    const deviceClean = new DeviceCleanWork(deviceCleanWorkProps);

    expect(deviceClean).to.be.instanceOf(ValueObject);
    expect(deviceClean.size).to.be.equal(deviceCleanWorkProps.size);
    expect(deviceClean.time).to.be.equal(deviceCleanWorkProps.time);
  });

  it("should throw an error when 'size' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceCleanWork({ ...givenSomeDeviceCleanWorkProps(), size: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'size' for DeviceCleanWork not provided`,
    );
  });

  it("should throw an error when 'size' property is invalid", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceCleanWork({ ...givenSomeDeviceCleanWorkProps(), size: 1 })).to.throw(
      ArgumentInvalidException,
      `Value '1' for property 'size' of DeviceCleanWork is not an instance of CleanSize`,
    );
  });

  it("should throw an error when 'time' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceCleanWork({ ...givenSomeDeviceCleanWorkProps(), time: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'time' for DeviceCleanWork not provided`,
    );
  });

  it("should throw an error when 'time' property is invalid", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceCleanWork({ ...givenSomeDeviceCleanWorkProps(), time: 1 })).to.throw(
      ArgumentInvalidException,
      `Value '1' for property 'time' of DeviceCleanWork is not an instance of DeviceTime`,
    );
  });
});
