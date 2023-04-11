import { ArgumentInvalidException, ArgumentNotProvidedException, ID, Query } from '@agnoc/toolkit';
import { expect } from 'chai';
import { Device } from '../aggregate-roots/device.aggregate-root';
import { givenSomeDeviceProps } from '../test-support';
import { FindDeviceQuery } from './find-device.query';
import type { FindDeviceQueryInput, FindDeviceQueryOutput } from './find-device.query';

describe('FindDeviceQuery', function () {
  it('should be created', function () {
    const input = givenAFindDeviceQueryInput();
    const query = new FindDeviceQuery(input);

    expect(query).to.be.instanceOf(Query);
    expect(query.deviceId).to.be.equal(input.deviceId);
  });

  it("should throw an error when 'deviceId' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new FindDeviceQuery({ ...givenAFindDeviceQueryInput(), deviceId: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'deviceId' for FindDeviceQuery not provided`,
    );
  });

  it("should throw an error when 'deviceId' is not an ID", function () {
    // @ts-expect-error - invalid property
    expect(() => new FindDeviceQuery({ ...givenAFindDeviceQueryInput(), deviceId: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'deviceId' of FindDeviceQuery is not an instance of ID`,
    );
  });

  it("should throw an error when 'device' is not provided", function () {
    const query = new FindDeviceQuery(givenAFindDeviceQueryInput());

    // @ts-expect-error - missing property
    expect(() => query.validateOutput({ ...givenAFindDeviceQueryOutput(), device: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'device' for FindDeviceQuery not provided`,
    );
  });

  it("should throw an error when 'device' is not a Device", function () {
    const query = new FindDeviceQuery(givenAFindDeviceQueryInput());

    // @ts-expect-error - missing property
    expect(() => query.validateOutput({ ...givenAFindDeviceQueryOutput(), device: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'device' of FindDeviceQuery is not an instance of Device`,
    );
  });
});

function givenAFindDeviceQueryInput(): FindDeviceQueryInput {
  return { deviceId: ID.generate() };
}

function givenAFindDeviceQueryOutput(): FindDeviceQueryOutput {
  return { device: new Device(givenSomeDeviceProps()) };
}
