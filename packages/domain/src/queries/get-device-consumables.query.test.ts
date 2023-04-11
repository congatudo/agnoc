import { ArgumentInvalidException, ArgumentNotProvidedException, ID, Query } from '@agnoc/toolkit';
import { expect } from 'chai';
import { givenSomeDeviceConsumableProps } from '../test-support';
import { DeviceConsumable } from '../value-objects/device-consumable.value-object';
import { GetDeviceConsumablesQuery } from './get-device-consumables.query';
import type { GetDeviceConsumablesQueryInput, GetDeviceConsumablesQueryOutput } from './get-device-consumables.query';

describe('GetDeviceConsumablesQuery', function () {
  it('should be created', function () {
    const input = givenAGetDeviceConsumablesQueryInput();
    const query = new GetDeviceConsumablesQuery(input);

    expect(query).to.be.instanceOf(Query);
    expect(query.deviceId).to.be.equal(input.deviceId);
  });

  it("should throw an error when 'deviceId' is not provided", function () {
    expect(
      // @ts-expect-error - missing property
      () => new GetDeviceConsumablesQuery({ ...givenAGetDeviceConsumablesQueryInput(), deviceId: undefined }),
    ).to.throw(ArgumentNotProvidedException, `Property 'deviceId' for GetDeviceConsumablesQuery not provided`);
  });

  it("should throw an error when 'deviceId' is not an ID", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new GetDeviceConsumablesQuery({ ...givenAGetDeviceConsumablesQueryInput(), deviceId: 'foo' }),
    ).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'deviceId' of GetDeviceConsumablesQuery is not an instance of ID`,
    );
  });

  it("should throw an error when 'consumables' is not provided", function () {
    const query = new GetDeviceConsumablesQuery(givenAGetDeviceConsumablesQueryInput());

    // @ts-expect-error - missing property
    expect(() => query.validateOutput({ ...givenAGetDeviceConsumablesQueryOutput(), consumables: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'consumables' for GetDeviceConsumablesQuery not provided`,
    );
  });

  it("should throw an error when 'consumables' is not an array", function () {
    const query = new GetDeviceConsumablesQuery(givenAGetDeviceConsumablesQueryInput());

    // @ts-expect-error - missing property
    expect(() => query.validateOutput({ ...givenAGetDeviceConsumablesQueryOutput(), consumables: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'consumables' of GetDeviceConsumablesQuery is not an array`,
    );
  });

  it("should throw an error when 'consumables' is not an array of DeviceConsumable", function () {
    const query = new GetDeviceConsumablesQuery(givenAGetDeviceConsumablesQueryInput());

    // @ts-expect-error - missing property
    expect(() => query.validateOutput({ ...givenAGetDeviceConsumablesQueryOutput(), consumables: ['foo'] })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'consumables' of GetDeviceConsumablesQuery is not an array of DeviceConsumable`,
    );
  });
});

function givenAGetDeviceConsumablesQueryInput(): GetDeviceConsumablesQueryInput {
  return { deviceId: ID.generate() };
}

function givenAGetDeviceConsumablesQueryOutput(): GetDeviceConsumablesQueryOutput {
  return { consumables: [new DeviceConsumable(givenSomeDeviceConsumableProps())] };
}
