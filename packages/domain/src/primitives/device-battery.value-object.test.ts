import { ArgumentInvalidException, ArgumentOutOfRangeException, ValueObject } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceBattery } from './device-battery.value-object';

describe('DeviceBattery', function () {
  it('should be created', function () {
    const deviceBattery = new DeviceBattery({ value: 50 });

    expect(deviceBattery).to.be.instanceOf(ValueObject);
    expect(deviceBattery.value).to.be.equal(50);
  });

  it('should throw an error when value is invalid', function () {
    // @ts-expect-error - invalid value
    expect(() => new DeviceBattery({ value: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for device battery is not a number`,
    );
  });

  it('should throw an error when value is out of range', function () {
    expect(() => new DeviceBattery({ value: 150 })).to.throw(
      ArgumentOutOfRangeException,
      `Value '150' for device battery is out of range`,
    );
  });
});
