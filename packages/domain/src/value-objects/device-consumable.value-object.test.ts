import { ArgumentInvalidException, ArgumentNotProvidedException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { givenSomeDeviceConsumableProps } from '../test-support';
import { DeviceConsumable } from './device-consumable.value-object';

describe('DeviceConsumable', function () {
  it('should create a device consumable', function () {
    const deviceConsumableProps = givenSomeDeviceConsumableProps();
    const deviceConsumable = new DeviceConsumable(deviceConsumableProps);

    expect(deviceConsumable.type).to.be.equal(deviceConsumableProps.type);
    expect(deviceConsumable.minutesUsed).to.be.equal(deviceConsumableProps.minutesUsed);
  });

  it("should throw an error when 'type' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceConsumable({ ...givenSomeDeviceConsumableProps(), type: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'type' for DeviceConsumable not provided`,
    );
  });

  it("should throw an error when 'type' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceConsumable({ ...givenSomeDeviceConsumableProps(), type: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'type' for DeviceConsumable is invalid`,
    );
  });

  it("should throw an error when 'minutesUsed' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceConsumable({ ...givenSomeDeviceConsumableProps(), minutesUsed: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'minutesUsed' for DeviceConsumable not provided`,
    );
  });

  it("should throw an error when 'minutesUsed' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceConsumable({ ...givenSomeDeviceConsumableProps(), minutesUsed: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'minutesUsed' for DeviceConsumable is not a number`,
    );
  });
});
