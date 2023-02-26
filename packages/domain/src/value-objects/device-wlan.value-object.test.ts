import { ArgumentInvalidException, ArgumentNotProvidedException, ValueObject } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceWlan } from './device-wlan.value-object';

describe('DeviceWlan', function () {
  let ipv4: string;
  let ssid: string;
  let port: number;
  let mask: string;
  let mac: string;

  beforeEach(function () {
    ipv4 = '127.0.0.1';
    ssid = 'ssid';
    port = 80;
    mask = '255.255.255.0';
    mac = '00:00:00:00:00:00';
  });

  it('should be created', function () {
    const deviceWlan = new DeviceWlan({ ipv4, ssid, port, mask, mac });

    expect(deviceWlan).to.be.instanceOf(ValueObject);
    expect(deviceWlan.ipv4).to.be.equal('127.0.0.1');
    expect(deviceWlan.ssid).to.be.equal('ssid');
    expect(deviceWlan.port).to.be.equal(80);
    expect(deviceWlan.mask).to.be.equal('255.255.255.0');
    expect(deviceWlan.mac).to.be.equal('00:00:00:00:00:00');
  });

  it("should throw an error when 'ipv4' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceWlan({ ssid, port, mask, mac })).to.throw(
      ArgumentNotProvidedException,
      `Property 'ipv4' for device wlan not provided`,
    );
  });

  it("should throw an error when 'ipv4' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceWlan({ ipv4: 1, ssid, port, mask, mac })).to.throw(
      ArgumentInvalidException,
      `Value '1' for property 'ipv4' for device wlan is not a string`,
    );
  });

  it("should throw an error when 'ssid' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceWlan({ ipv4, port, mask, mac })).to.throw(
      ArgumentNotProvidedException,
      `Property 'ssid' for device wlan not provided`,
    );
  });

  it("should throw an error when 'ssid' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceWlan({ ipv4, ssid: 1, port, mask, mac })).to.throw(
      ArgumentInvalidException,
      `Value '1' for property 'ssid' for device wlan is not a string`,
    );
  });

  it("should throw an error when 'port' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceWlan({ ipv4, ssid, mask, mac })).to.throw(
      ArgumentNotProvidedException,
      `Property 'port' for device wlan not provided`,
    );
  });

  it("should throw an error when 'port' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceWlan({ ipv4, ssid, port: 'foo', mask, mac })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'port' for device wlan is not a number`,
    );
  });

  it("should throw an error when 'mask' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceWlan({ ipv4, ssid, port, mac })).to.throw(
      ArgumentNotProvidedException,
      `Property 'mask' for device wlan not provided`,
    );
  });

  it("should throw an error when 'mask' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceWlan({ ipv4, ssid, port, mask: 1, mac })).to.throw(
      ArgumentInvalidException,
      `Value '1' for property 'mask' for device wlan is not a string`,
    );
  });

  it("should throw an error when 'mac' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceWlan({ ipv4, ssid, port, mask })).to.throw(
      ArgumentNotProvidedException,
      `Property 'mac' for device wlan not provided`,
    );
  });

  it("should throw an error when 'mac' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceWlan({ ipv4, ssid, port, mask, mac: 1 })).to.throw(
      ArgumentInvalidException,
      `Value '1' for property 'mac' for device wlan is not a string`,
    );
  });
});
