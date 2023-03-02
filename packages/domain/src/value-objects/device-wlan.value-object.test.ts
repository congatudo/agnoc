import { ArgumentInvalidException, ArgumentNotProvidedException, ValueObject } from '@agnoc/toolkit';
import { expect } from 'chai';
import { givenSomeDeviceWlanProps } from '../test-support';
import { DeviceWlan } from './device-wlan.value-object';

describe('DeviceWlan', function () {
  it('should be created', function () {
    const deviceWlanProps = givenSomeDeviceWlanProps();
    const deviceWlan = new DeviceWlan(deviceWlanProps);

    expect(deviceWlan).to.be.instanceOf(ValueObject);
    expect(deviceWlan.ipv4).to.be.equal(deviceWlanProps.ipv4);
    expect(deviceWlan.ssid).to.be.equal(deviceWlanProps.ssid);
    expect(deviceWlan.port).to.be.equal(deviceWlanProps.port);
    expect(deviceWlan.mask).to.be.equal(deviceWlanProps.mask);
    expect(deviceWlan.mac).to.be.equal(deviceWlanProps.mac);
  });

  it("should throw an error when 'ipv4' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceWlan({ ...givenSomeDeviceWlanProps(), ipv4: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'ipv4' for DeviceWlan not provided`,
    );
  });

  it("should throw an error when 'ipv4' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceWlan({ ...givenSomeDeviceWlanProps(), ipv4: 1 })).to.throw(
      ArgumentInvalidException,
      `Value '1' for property 'ipv4' for DeviceWlan is not a string`,
    );
  });

  it("should throw an error when 'ssid' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceWlan({ ...givenSomeDeviceWlanProps(), ssid: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'ssid' for DeviceWlan not provided`,
    );
  });

  it("should throw an error when 'ssid' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceWlan({ ...givenSomeDeviceWlanProps(), ssid: 1 })).to.throw(
      ArgumentInvalidException,
      `Value '1' for property 'ssid' for DeviceWlan is not a string`,
    );
  });

  it("should throw an error when 'port' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceWlan({ ...givenSomeDeviceWlanProps(), port: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'port' for DeviceWlan not provided`,
    );
  });

  it("should throw an error when 'port' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceWlan({ ...givenSomeDeviceWlanProps(), port: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'port' for DeviceWlan is not a number`,
    );
  });

  it("should throw an error when 'mask' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceWlan({ ...givenSomeDeviceWlanProps(), mask: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'mask' for DeviceWlan not provided`,
    );
  });

  it("should throw an error when 'mask' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceWlan({ ...givenSomeDeviceWlanProps(), mask: 1 })).to.throw(
      ArgumentInvalidException,
      `Value '1' for property 'mask' for DeviceWlan is not a string`,
    );
  });

  it("should throw an error when 'mac' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceWlan({ ...givenSomeDeviceWlanProps(), mac: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'mac' for DeviceWlan not provided`,
    );
  });

  it("should throw an error when 'mac' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceWlan({ ...givenSomeDeviceWlanProps(), mac: 1 })).to.throw(
      ArgumentInvalidException,
      `Value '1' for property 'mac' for DeviceWlan is not a string`,
    );
  });
});
