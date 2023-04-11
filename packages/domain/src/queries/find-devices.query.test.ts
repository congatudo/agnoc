import { ArgumentInvalidException, ArgumentNotProvidedException, Query } from '@agnoc/toolkit';
import { expect } from 'chai';
import { Device } from '../aggregate-roots/device.aggregate-root';
import { givenSomeDeviceProps } from '../test-support';
import { FindDevicesQuery } from './find-devices.query';
import type { FindDevicesQueryOutput } from './find-devices.query';

describe('FindDevicesQuery', function () {
  it('should be created', function () {
    const query = new FindDevicesQuery();

    expect(query).to.be.instanceOf(Query);
  });

  it("should throw an error when 'devices' is not provided", function () {
    const query = new FindDevicesQuery();

    // @ts-expect-error - missing property
    expect(() => query.validateOutput({ ...givenAFindDevicesQueryOutput(), devices: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'devices' for FindDevicesQuery not provided`,
    );
  });

  it("should throw an error when 'devices' is not an array", function () {
    const query = new FindDevicesQuery();

    // @ts-expect-error - missing property
    expect(() => query.validateOutput({ ...givenAFindDevicesQueryOutput(), devices: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'devices' of FindDevicesQuery is not an array`,
    );
  });

  it("should throw an error when 'devices' is not an array of Devices", function () {
    const query = new FindDevicesQuery();

    // @ts-expect-error - missing property
    expect(() => query.validateOutput({ ...givenAFindDevicesQueryOutput(), devices: ['foo'] })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'devices' of FindDevicesQuery is not an array of Device`,
    );
  });
});

function givenAFindDevicesQueryOutput(): FindDevicesQueryOutput {
  return { devices: [new Device(givenSomeDeviceProps())] };
}
