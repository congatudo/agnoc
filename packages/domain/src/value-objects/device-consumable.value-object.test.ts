import { ArgumentInvalidException, ArgumentNotProvidedException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceConsumable, DeviceConsumableType } from './device-consumable.value-object';

describe('DeviceConsumable', function () {
  it('should create a device consumable', function () {
    const deviceConsumable = new DeviceConsumable({
      type: DeviceConsumableType.MainBrush,
      minutesUsed: 50,
    });

    expect(deviceConsumable.type).to.be.equal(DeviceConsumableType.MainBrush);
    expect(deviceConsumable.minutesUsed).to.be.equal(50);
  });

  it("should throw an error when 'type' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceConsumable({ minutesUsed: 50 })).to.throw(
      ArgumentNotProvidedException,
      `Property 'type' for DeviceConsumable not provided`,
    );
  });

  it("should throw an error when 'type' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceConsumable({ type: 'foo', minutesUsed: 50 })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'type' for DeviceConsumable is invalid`,
    );
  });

  it("should throw an error when 'minutesUsed' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceConsumable({ type: DeviceConsumableType.MainBrush })).to.throw(
      ArgumentNotProvidedException,
      `Property 'minutesUsed' for DeviceConsumable not provided`,
    );
  });

  it("should throw an error when 'minutesUsed' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceConsumable({ type: DeviceConsumableType.MainBrush, minutesUsed: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'minutesUsed' for DeviceConsumable is not a number`,
    );
  });
});
