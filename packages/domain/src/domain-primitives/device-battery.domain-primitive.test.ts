import { ArgumentInvalidException, ArgumentOutOfRangeException, DomainPrimitive } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceBattery } from './device-battery.domain-primitive';

describe('DeviceBattery', function () {
  it('should be created', function () {
    const deviceBattery = new DeviceBattery(50);

    expect(deviceBattery).to.be.instanceOf(DomainPrimitive);
    expect(deviceBattery.value).to.be.equal(50);
  });

  it('should throw an error when value is invalid', function () {
    // @ts-expect-error - invalid value
    expect(() => new DeviceBattery('foo')).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for DeviceBattery is not a number`,
    );
  });

  it('should throw an error when value is out of range', function () {
    expect(() => new DeviceBattery(150)).to.throw(
      ArgumentOutOfRangeException,
      `Value '150' for DeviceBattery is out of range`,
    );
  });
});
