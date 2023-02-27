import { ArgumentInvalidException, DomainPrimitive } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceWaterLevel, DeviceWaterLevelValue } from './device-water-level.value-object';

describe('DeviceWaterLevel', function () {
  it('should be created', function () {
    const deviceWaterLevel = new DeviceWaterLevel(DeviceWaterLevelValue.Off);

    expect(deviceWaterLevel).to.be.instanceOf(DomainPrimitive);
    expect(deviceWaterLevel.value).to.be.equal(DeviceWaterLevelValue.Off);
  });

  it('should throw an error when value is invalid', function () {
    // @ts-expect-error - invalid value
    expect(() => new DeviceWaterLevel({ value: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for device water level is invalid`,
    );
  });
});
