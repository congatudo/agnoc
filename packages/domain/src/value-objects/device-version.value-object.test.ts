import { ValueObject, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceVersion } from './device-version.value-object';

describe('DeviceVersion', function () {
  it('should be created', function () {
    const deviceVersion = new DeviceVersion({ software: '1.0.0', hardware: '1.0.0' });

    expect(deviceVersion).to.be.instanceOf(ValueObject);
    expect(deviceVersion.software).to.be.equal('1.0.0');
    expect(deviceVersion.hardware).to.be.equal('1.0.0');
  });

  it("should throw an error when 'software' is not provided", function () {
    // @ts-expect-error - software is not provided
    expect(() => new DeviceVersion({ hardware: '1.0.0' })).to.throw(
      ArgumentNotProvidedException,
      "Property 'software' for DeviceVersion not provided",
    );
  });

  it("should throw an error when 'hardware' is not provided", function () {
    // @ts-expect-error - hardware is not provided
    expect(() => new DeviceVersion({ software: '1.0.0' })).to.throw(
      ArgumentNotProvidedException,
      "Property 'hardware' for DeviceVersion not provided",
    );
  });

  it("should throw an error when 'software' is not a string", function () {
    // @ts-expect-error - software is not a string
    expect(() => new DeviceVersion({ software: 1, hardware: '1.0.0' })).to.throw(
      ArgumentInvalidException,
      "Value '1' for property 'software' for DeviceVersion is not a string",
    );
  });

  it("should throw an error when 'hardware' is not a string", function () {
    // @ts-expect-error - hardware is not a string
    expect(() => new DeviceVersion({ software: '1.0.0', hardware: 1 })).to.throw(
      ArgumentInvalidException,
      "Value '1' for property 'hardware' for DeviceVersion is not a string",
    );
  });
});
