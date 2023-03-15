import { ArgumentInvalidException, ArgumentNotProvidedException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceCapability, DeviceSystem } from './device-system.value-object';

describe('DeviceSystem', function () {
  it('should be created with a 3090 model', function () {
    const deviceSystem = new DeviceSystem({ type: 3 });

    expect(deviceSystem).to.be.instanceOf(DeviceSystem);
    expect(deviceSystem.type).to.be.equal(3);
    expect(deviceSystem.model).to.be.equal('C3090');
    expect(deviceSystem.supports(DeviceCapability.MAP_PLANS)).to.be.equal(false);
    expect(deviceSystem.supports(DeviceCapability.CONSUMABLES)).to.be.equal(false);
    expect(deviceSystem.supports(DeviceCapability.WATER_SENSOR)).to.be.equal(false);
  });

  it('should be created with a 3490 model', function () {
    const deviceSystem = new DeviceSystem({ type: 9 });

    expect(deviceSystem).to.be.instanceOf(DeviceSystem);
    expect(deviceSystem.type).to.be.equal(9);
    expect(deviceSystem.model).to.be.equal('C3490');
    expect(deviceSystem.supports(DeviceCapability.MAP_PLANS)).to.be.equal(true);
    expect(deviceSystem.supports(DeviceCapability.CONSUMABLES)).to.be.equal(true);
    expect(deviceSystem.supports(DeviceCapability.WATER_SENSOR)).to.be.equal(true);
  });

  it('should be created with an unknown model', function () {
    const deviceSystem = new DeviceSystem({ type: -1 });

    expect(deviceSystem).to.be.instanceOf(DeviceSystem);
    expect(deviceSystem.type).to.be.equal(-1);
    expect(deviceSystem.model).to.be.equal('unknown');
    expect(deviceSystem.supports(DeviceCapability.MAP_PLANS)).to.be.equal(true);
    expect(deviceSystem.supports(DeviceCapability.CONSUMABLES)).to.be.equal(true);
    expect(deviceSystem.supports(DeviceCapability.WATER_SENSOR)).to.be.equal(true);
  });

  it("should throw an error when 'type' is not provided", function () {
    // @ts-expect-error - invalid value
    expect(() => new DeviceSystem({ foo: 'bar' })).to.throw(
      ArgumentNotProvidedException,
      `Property 'type' for DeviceSystem not provided`,
    );
  });

  it("should throw an error when 'type' is not a number", function () {
    // @ts-expect-error - invalid value
    expect(() => new DeviceSystem({ type: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'type' of DeviceSystem is not a number`,
    );
  });
});
