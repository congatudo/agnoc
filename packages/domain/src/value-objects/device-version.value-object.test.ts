import { ValueObject, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { givenSomeDeviceVersionProps } from '../test-support';
import { DeviceVersion } from './device-version.value-object';

describe('DeviceVersion', function () {
  it('should be created', function () {
    const deviceVersionProps = givenSomeDeviceVersionProps();
    const deviceVersion = new DeviceVersion(deviceVersionProps);

    expect(deviceVersion).to.be.instanceOf(ValueObject);
    expect(deviceVersion.software).to.be.equal(deviceVersionProps.software);
    expect(deviceVersion.hardware).to.be.equal(deviceVersionProps.hardware);
  });

  it("should throw an error when 'software' is not provided", function () {
    // @ts-expect-error - software is not provided
    expect(() => new DeviceVersion({ ...givenSomeDeviceVersionProps(), software: undefined })).to.throw(
      ArgumentNotProvidedException,
      "Property 'software' for DeviceVersion not provided",
    );
  });

  it("should throw an error when 'hardware' is not provided", function () {
    // @ts-expect-error - hardware is not provided
    expect(() => new DeviceVersion({ ...givenSomeDeviceVersionProps(), hardware: undefined })).to.throw(
      ArgumentNotProvidedException,
      "Property 'hardware' for DeviceVersion not provided",
    );
  });

  it("should throw an error when 'software' is not a string", function () {
    // @ts-expect-error - software is not a string
    expect(() => new DeviceVersion({ ...givenSomeDeviceVersionProps(), software: 1 })).to.throw(
      ArgumentInvalidException,
      "Value '1' for property 'software' of DeviceVersion is not a string",
    );
  });

  it("should throw an error when 'hardware' is not a string", function () {
    // @ts-expect-error - hardware is not a string
    expect(() => new DeviceVersion({ ...givenSomeDeviceVersionProps(), hardware: 1 })).to.throw(
      ArgumentInvalidException,
      "Value '1' for property 'hardware' of DeviceVersion is not a string",
    );
  });
});
