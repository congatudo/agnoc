import { ArgumentInvalidException, ArgumentNotProvidedException, Entity } from '@agnoc/toolkit';
import { expect } from 'chai';
import { givenSomeDeviceOrderProps } from '../test-support';
import { DeviceOrder } from './device-order.entity';

describe('DeviceOrder', function () {
  it('should be created', function () {
    const deviceOrderProps = givenSomeDeviceOrderProps();
    const deviceOrder = new DeviceOrder(deviceOrderProps);

    expect(deviceOrder).to.be.instanceOf(Entity);
    expect(deviceOrder.id).to.be.equal(deviceOrderProps.id);
    expect(deviceOrder.mapId).to.be.equal(deviceOrderProps.mapId);
    expect(deviceOrder.planId).to.be.equal(deviceOrderProps.planId);
    expect(deviceOrder.isEnabled).to.be.equal(deviceOrderProps.isEnabled);
    expect(deviceOrder.isRepeatable).to.be.equal(deviceOrderProps.isRepeatable);
    expect(deviceOrder.isDeepClean).to.be.equal(deviceOrderProps.isDeepClean);
    expect(deviceOrder.weekDays).to.be.equal(deviceOrderProps.weekDays);
    expect(deviceOrder.time).to.be.equal(deviceOrderProps.time);
    expect(deviceOrder.cleanMode).to.be.equal(deviceOrderProps.cleanMode);
    expect(deviceOrder.fanSpeed).to.be.equal(deviceOrderProps.fanSpeed);
    expect(deviceOrder.waterLevel).to.be.equal(deviceOrderProps.waterLevel);
  });

  it("should throw an error when the 'mapId' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceOrder({ ...givenSomeDeviceOrderProps(), mapId: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'mapId' for DeviceOrder not provided`,
    );
  });

  it("should throw an error when the 'planId' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceOrder({ ...givenSomeDeviceOrderProps(), planId: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'planId' for DeviceOrder not provided`,
    );
  });

  it("should throw an error when the 'isEnabled' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceOrder({ ...givenSomeDeviceOrderProps(), isEnabled: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'isEnabled' for DeviceOrder not provided`,
    );
  });

  it("should throw an error when the 'isRepeatable' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceOrder({ ...givenSomeDeviceOrderProps(), isRepeatable: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'isRepeatable' for DeviceOrder not provided`,
    );
  });

  it("should throw an error when the 'isDeepClean' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceOrder({ ...givenSomeDeviceOrderProps(), isDeepClean: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'isDeepClean' for DeviceOrder not provided`,
    );
  });

  it("should throw an error when the 'weekDays' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceOrder({ ...givenSomeDeviceOrderProps(), weekDays: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'weekDays' for DeviceOrder not provided`,
    );
  });

  it("should throw an error when the 'time' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceOrder({ ...givenSomeDeviceOrderProps(), time: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'time' for DeviceOrder not provided`,
    );
  });

  it("should throw an error when the 'cleanMode' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceOrder({ ...givenSomeDeviceOrderProps(), cleanMode: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'cleanMode' for DeviceOrder not provided`,
    );
  });

  it("should throw an error when the 'fanSpeed' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceOrder({ ...givenSomeDeviceOrderProps(), fanSpeed: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'fanSpeed' for DeviceOrder not provided`,
    );
  });

  it("should throw an error when the 'waterLevel' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceOrder({ ...givenSomeDeviceOrderProps(), waterLevel: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'waterLevel' for DeviceOrder not provided`,
    );
  });

  it("should throw an error when the 'mapId' is not an ID", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceOrder({ ...givenSomeDeviceOrderProps(), mapId: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'mapId' of DeviceOrder is not an instance of ID`,
    );
  });

  it("should throw an error when the 'planId' is not an ID", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceOrder({ ...givenSomeDeviceOrderProps(), planId: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'planId' of DeviceOrder is not an instance of ID`,
    );
  });

  it("should throw an error when the 'isEnabled' is not a boolean", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceOrder({ ...givenSomeDeviceOrderProps(), isEnabled: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'isEnabled' of DeviceOrder is not a boolean`,
    );
  });

  it("should throw an error when the 'isRepeatable' is not a boolean", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceOrder({ ...givenSomeDeviceOrderProps(), isRepeatable: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'isRepeatable' of DeviceOrder is not a boolean`,
    );
  });

  it("should throw an error when the 'isDeepClean' is not a boolean", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceOrder({ ...givenSomeDeviceOrderProps(), isDeepClean: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'isDeepClean' of DeviceOrder is not a boolean`,
    );
  });

  it("should throw an error when the 'weekDays' is not an array", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceOrder({ ...givenSomeDeviceOrderProps(), weekDays: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'weekDays' of DeviceOrder is not an array`,
    );
  });

  it("should throw an error when the 'weekDays' is not an array of WeekDay", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceOrder({ ...givenSomeDeviceOrderProps(), weekDays: ['foo', 1] })).to.throw(
      ArgumentInvalidException,
      `Value 'foo, 1' for property 'weekDays' of DeviceOrder is not an array of WeekDay`,
    );
  });

  it("should throw an error when the 'time' is not a DeviceTime", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceOrder({ ...givenSomeDeviceOrderProps(), time: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'time' of DeviceOrder is not an instance of DeviceTime`,
    );
  });

  it("should throw an error when the 'cleanMode' is not a CleanMode", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceOrder({ ...givenSomeDeviceOrderProps(), cleanMode: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'cleanMode' of DeviceOrder is not an instance of CleanMode`,
    );
  });

  it("should throw an error when the 'fanSpeed' is not a FanSpeed", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceOrder({ ...givenSomeDeviceOrderProps(), fanSpeed: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'fanSpeed' of DeviceOrder is not an instance of DeviceFanSpeed`,
    );
  });

  it("should throw an error when the 'waterLevel' is not a WaterLevel", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceOrder({ ...givenSomeDeviceOrderProps(), waterLevel: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'waterLevel' of DeviceOrder is not an instance of DeviceWaterLevel`,
    );
  });
});
