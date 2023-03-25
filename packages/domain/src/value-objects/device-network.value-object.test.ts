import { ArgumentInvalidException, ArgumentNotProvidedException, ValueObject } from '@agnoc/toolkit';
import { expect } from 'chai';
import { givenSomeDeviceNetworkProps } from '../test-support';
import { DeviceNetwork } from './device-network.value-object';

describe('DeviceNetwork', function () {
  it('should be created', function () {
    const deviceNetworkProps = givenSomeDeviceNetworkProps();
    const deviceNetwork = new DeviceNetwork(deviceNetworkProps);

    expect(deviceNetwork).to.be.instanceOf(ValueObject);
    expect(deviceNetwork.ipv4).to.be.equal(deviceNetworkProps.ipv4);
    expect(deviceNetwork.ssid).to.be.equal(deviceNetworkProps.ssid);
    expect(deviceNetwork.port).to.be.equal(deviceNetworkProps.port);
    expect(deviceNetwork.mask).to.be.equal(deviceNetworkProps.mask);
    expect(deviceNetwork.mac).to.be.equal(deviceNetworkProps.mac);
  });

  it("should throw an error when 'ipv4' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceNetwork({ ...givenSomeDeviceNetworkProps(), ipv4: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'ipv4' for DeviceNetwork not provided`,
    );
  });

  it("should throw an error when 'ipv4' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceNetwork({ ...givenSomeDeviceNetworkProps(), ipv4: 1 })).to.throw(
      ArgumentInvalidException,
      `Value '1' for property 'ipv4' of DeviceNetwork is not a string`,
    );
  });

  it("should throw an error when 'ssid' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceNetwork({ ...givenSomeDeviceNetworkProps(), ssid: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'ssid' for DeviceNetwork not provided`,
    );
  });

  it("should throw an error when 'ssid' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceNetwork({ ...givenSomeDeviceNetworkProps(), ssid: 1 })).to.throw(
      ArgumentInvalidException,
      `Value '1' for property 'ssid' of DeviceNetwork is not a string`,
    );
  });

  it("should throw an error when 'port' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceNetwork({ ...givenSomeDeviceNetworkProps(), port: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'port' for DeviceNetwork not provided`,
    );
  });

  it("should throw an error when 'port' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceNetwork({ ...givenSomeDeviceNetworkProps(), port: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'port' of DeviceNetwork is not a number`,
    );
  });

  it("should throw an error when 'mask' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceNetwork({ ...givenSomeDeviceNetworkProps(), mask: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'mask' for DeviceNetwork not provided`,
    );
  });

  it("should throw an error when 'mask' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceNetwork({ ...givenSomeDeviceNetworkProps(), mask: 1 })).to.throw(
      ArgumentInvalidException,
      `Value '1' for property 'mask' of DeviceNetwork is not a string`,
    );
  });

  it("should throw an error when 'mac' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceNetwork({ ...givenSomeDeviceNetworkProps(), mac: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'mac' for DeviceNetwork not provided`,
    );
  });

  it("should throw an error when 'mac' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceNetwork({ ...givenSomeDeviceNetworkProps(), mac: 1 })).to.throw(
      ArgumentInvalidException,
      `Value '1' for property 'mac' of DeviceNetwork is not a string`,
    );
  });
});
