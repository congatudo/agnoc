import { AggregateRoot, ArgumentInvalidException, ArgumentNotProvidedException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceBatteryChangedDomainEvent } from '../domain-events/device-battery-changed.domain-event';
import { DeviceConnectedDomainEvent } from '../domain-events/device-connected.domain-event';
import { DeviceLockedDomainEvent } from '../domain-events/device-locked.domain-event';
import { DeviceBattery } from '../domain-primitives/device-battery.domain-primitive';
import { DeviceError, DeviceErrorValue } from '../domain-primitives/device-error.domain-primitive';
import { DeviceFanSpeed, DeviceFanSpeedValue } from '../domain-primitives/device-fan-speed.domain-primitive';
import { DeviceMode, DeviceModeValue } from '../domain-primitives/device-mode.domain-primitive';
import { DeviceState, DeviceStateValue } from '../domain-primitives/device-state.domain-primitive';
import { DeviceWaterLevel, DeviceWaterLevelValue } from '../domain-primitives/device-water-level.domain-primitive';
import { DeviceMap } from '../entities/device-map.entity';
import { DeviceOrder } from '../entities/device-order.entity';
import {
  givenSomeDeviceCleanWorkProps,
  givenSomeDeviceConsumableProps,
  givenSomeDeviceMapProps,
  givenSomeDeviceOrderProps,
  givenSomeDeviceProps,
  givenSomeDeviceSettingsProps,
  givenSomeDeviceSystemProps,
  givenSomeDeviceVersionProps,
  givenSomeDeviceWlanProps,
} from '../test-support';
import { DeviceCleanWork } from '../value-objects/device-clean-work.value-object';
import { DeviceConsumable } from '../value-objects/device-consumable.value-object';
import { DeviceSettings } from '../value-objects/device-settings.value-object';
import { DeviceSystem } from '../value-objects/device-system.value-object';
import { DeviceVersion } from '../value-objects/device-version.value-object';
import { DeviceWlan } from '../value-objects/device-wlan.value-object';
import { Device } from './device.aggregate-root';

describe('Device', function () {
  it('should be created', function () {
    const deviceProps = {
      ...givenSomeDeviceProps(),
      orders: [new DeviceOrder(givenSomeDeviceOrderProps())],
      consumables: [new DeviceConsumable(givenSomeDeviceConsumableProps())],
    };
    const device = new Device(deviceProps);

    expect(device).to.be.instanceOf(AggregateRoot);
    expect(device.id).to.be.equal(deviceProps.id);
    expect(device.userId).to.be.equal(deviceProps.userId);
    expect(device.system).to.be.equal(deviceProps.system);
    expect(device.version).to.be.equal(deviceProps.version);
    expect(device.battery).to.be.equal(deviceProps.battery);
    expect(device.isConnected).to.be.equal(deviceProps.isConnected);
    expect(device.isLocked).to.be.equal(deviceProps.isLocked);
  });

  it("should throw an error when 'userId' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new Device({ ...givenSomeDeviceProps(), userId: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'userId' for Device not provided`,
    );
  });

  it("should throw an error when 'system' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new Device({ ...givenSomeDeviceProps(), system: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'system' for Device not provided`,
    );
  });

  it("should throw an error when 'version' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new Device({ ...givenSomeDeviceProps(), version: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'version' for Device not provided`,
    );
  });

  it("should throw an error when 'battery' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new Device({ ...givenSomeDeviceProps(), battery: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'battery' for Device not provided`,
    );
  });

  it("should throw an error when 'isConnected' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new Device({ ...givenSomeDeviceProps(), isConnected: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'isConnected' for Device not provided`,
    );
  });

  it("should throw an error when 'isLocked' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new Device({ ...givenSomeDeviceProps(), isLocked: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'isLocked' for Device not provided`,
    );
  });

  it("should throw an error when 'userId' is not an ID", function () {
    // @ts-expect-error - invalid property
    expect(() => new Device({ ...givenSomeDeviceProps(), userId: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'userId' of Device is not an instance of ID`,
    );
  });

  it("should throw an error when 'system' is not a DeviceSystem", function () {
    // @ts-expect-error - invalid property
    expect(() => new Device({ ...givenSomeDeviceProps(), system: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'system' of Device is not an instance of DeviceSystem`,
    );
  });

  it("should throw an error when 'version' is not a DeviceVersion", function () {
    // @ts-expect-error - invalid property
    expect(() => new Device({ ...givenSomeDeviceProps(), version: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'version' of Device is not an instance of DeviceVersion`,
    );
  });

  it("should throw an error when 'isConnected' is not a boolean", function () {
    // @ts-expect-error - invalid property
    expect(() => new Device({ ...givenSomeDeviceProps(), isConnected: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'isConnected' of Device is not a boolean`,
    );
  });

  it("should throw an error when 'isLocked' is not a boolean", function () {
    // @ts-expect-error - invalid property
    expect(() => new Device({ ...givenSomeDeviceProps(), isLocked: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'isLocked' of Device is not a boolean`,
    );
  });

  it("should throw an error when 'config' is not a DeviceSettings", function () {
    // @ts-expect-error - invalid property
    expect(() => new Device({ ...givenSomeDeviceProps(), config: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'config' of Device is not an instance of DeviceSettings`,
    );
  });

  it("should throw an error when 'currentClean' is not a DeviceCleanWork", function () {
    // @ts-expect-error - invalid property
    expect(() => new Device({ ...givenSomeDeviceProps(), currentClean: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'currentClean' of Device is not an instance of DeviceCleanWork`,
    );
  });

  it("should throw an error when 'orders' is not an array", function () {
    // @ts-expect-error - invalid property
    expect(() => new Device({ ...givenSomeDeviceProps(), orders: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'orders' of Device is not an array`,
    );
  });

  it("should throw an error when 'orders' is not an array of DeviceOrder", function () {
    // @ts-expect-error - invalid property
    expect(() => new Device({ ...givenSomeDeviceProps(), orders: ['foo', 1] })).to.throw(
      ArgumentInvalidException,
      `Value 'foo, 1' for property 'orders' of Device is not an array of DeviceOrder`,
    );
  });

  it("should throw an error when 'consumables' is not an array", function () {
    // @ts-expect-error - invalid property
    expect(() => new Device({ ...givenSomeDeviceProps(), consumables: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'consumables' of Device is not an array`,
    );
  });

  it("should throw an error when 'consumables' is not an array of DeviceConsumable", function () {
    // @ts-expect-error - invalid property
    expect(() => new Device({ ...givenSomeDeviceProps(), consumables: ['foo', 1] })).to.throw(
      ArgumentInvalidException,
      `Value 'foo, 1' for property 'consumables' of Device is not an array of DeviceConsumable`,
    );
  });

  it("should throw an error when 'map' is not a DeviceMap", function () {
    // @ts-expect-error - invalid property
    expect(() => new Device({ ...givenSomeDeviceProps(), map: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'map' of Device is not an instance of DeviceMap`,
    );
  });

  it("should throw an error when 'wlan' is not a DeviceWlan", function () {
    // @ts-expect-error - invalid property
    expect(() => new Device({ ...givenSomeDeviceProps(), wlan: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'wlan' of Device is not an instance of DeviceWlan`,
    );
  });

  it("should throw an error when 'battery' is not a DeviceBattery", function () {
    // @ts-expect-error - invalid property
    expect(() => new Device({ ...givenSomeDeviceProps(), battery: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'battery' of Device is not an instance of DeviceBattery`,
    );
  });

  it("should throw an error when 'state' is not a DeviceState", function () {
    // @ts-expect-error - invalid property
    expect(() => new Device({ ...givenSomeDeviceProps(), state: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'state' of Device is not an instance of DeviceState`,
    );
  });

  it("should throw an error when 'mode' is not a DeviceMode", function () {
    // @ts-expect-error - invalid property
    expect(() => new Device({ ...givenSomeDeviceProps(), mode: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'mode' of Device is not an instance of DeviceMode`,
    );
  });

  it("should throw an error when 'error' is not a DeviceError", function () {
    // @ts-expect-error - invalid property
    expect(() => new Device({ ...givenSomeDeviceProps(), error: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'error' of Device is not an instance of DeviceError`,
    );
  });

  it("should throw an error when 'fanSpeed' is not a DeviceFanSpeed", function () {
    // @ts-expect-error - invalid property
    expect(() => new Device({ ...givenSomeDeviceProps(), fanSpeed: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'fanSpeed' of Device is not an instance of DeviceFanSpeed`,
    );
  });

  it("should throw an error when 'waterLevel' is not a DeviceWaterLevel", function () {
    // @ts-expect-error - invalid property
    expect(() => new Device({ ...givenSomeDeviceProps(), waterLevel: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'waterLevel' of Device is not an instance of DeviceWaterLevel`,
    );
  });

  it("should throw an error when 'hasMopAttached' is not a boolean", function () {
    // @ts-expect-error - invalid property
    expect(() => new Device({ ...givenSomeDeviceProps(), hasMopAttached: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'hasMopAttached' of Device is not a boolean`,
    );
  });

  it("should throw an error when 'hasWaitingMap' is not a boolean", function () {
    // @ts-expect-error - invalid property
    expect(() => new Device({ ...givenSomeDeviceProps(), hasWaitingMap: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'hasWaitingMap' of Device is not a boolean`,
    );
  });

  describe('#setAsConnected()', function () {
    it('should update the device system', function () {
      const device = new Device({ ...givenSomeDeviceProps(), isConnected: false });

      device.setAsConnected();

      expect(device.isConnected).to.be.true;
      expect(device.domainEvents).to.deep.contain(new DeviceConnectedDomainEvent({ aggregateId: device.id }));
    });
  });

  describe('#setAsLocked()', function () {
    it('should update the device system', function () {
      const device = new Device({ ...givenSomeDeviceProps(), isLocked: false });

      device.setAsLocked();

      expect(device.isLocked).to.be.true;
      expect(device.domainEvents).to.deep.contain(new DeviceLockedDomainEvent({ aggregateId: device.id }));
    });
  });

  describe('#updateSystem()', function () {
    it('should update the device system', function () {
      const device = new Device(givenSomeDeviceProps());
      const system = new DeviceSystem(givenSomeDeviceSystemProps());

      device.updateSystem(system);

      expect(device.system).to.be.equal(system);
    });
  });

  describe('#updateVersion()', function () {
    it('should update the device version', function () {
      const device = new Device(givenSomeDeviceProps());
      const version = new DeviceVersion(givenSomeDeviceVersionProps());

      device.updateVersion(version);

      expect(device.version).to.be.equal(version);
    });
  });

  describe('#updateConfig()', function () {
    it('should update the device config', function () {
      const device = new Device(givenSomeDeviceProps());
      const config = new DeviceSettings(givenSomeDeviceSettingsProps());

      device.updateConfig(config);

      expect(device.config).to.be.equal(config);
    });
  });

  describe('#updateCurrentClean()', function () {
    it('should update the device current clean', function () {
      const device = new Device(givenSomeDeviceProps());
      const currentClean = new DeviceCleanWork(givenSomeDeviceCleanWorkProps());

      device.updateCurrentClean(currentClean);

      expect(device.currentClean).to.be.equal(currentClean);
    });
  });

  describe('#updateOrders()', function () {
    it('should update the device orders', function () {
      const device = new Device(givenSomeDeviceProps());
      const orders = [new DeviceOrder(givenSomeDeviceOrderProps())];

      device.updateOrders(orders);

      expect(device.orders).to.be.equal(orders);
    });
  });

  describe('#updateConsumables()', function () {
    it('should update the device consumables', function () {
      const device = new Device(givenSomeDeviceProps());
      const consumables = [new DeviceConsumable(givenSomeDeviceConsumableProps())];

      device.updateConsumables(consumables);

      expect(device.consumables).to.be.equal(consumables);
    });
  });

  describe('#updateMap()', function () {
    it('should update the device map', function () {
      const device = new Device(givenSomeDeviceProps());
      const map = new DeviceMap(givenSomeDeviceMapProps());

      device.updateMap(map);

      expect(device.map).to.be.equal(map);
    });
  });

  describe('#updateWlan()', function () {
    it('should update the device wlan', function () {
      const device = new Device(givenSomeDeviceProps());
      const wlan = new DeviceWlan(givenSomeDeviceWlanProps());

      device.updateWlan(wlan);

      expect(device.wlan).to.be.equal(wlan);
    });
  });

  describe('#updateBattery()', function () {
    it('should update the device battery', function () {
      const previousBattery = new DeviceBattery(60);
      const device = new Device({ ...givenSomeDeviceProps(), battery: previousBattery });
      const currentBattery = new DeviceBattery(50);

      device.updateBattery(currentBattery);

      expect(device.battery).to.be.equal(currentBattery);
      expect(device.domainEvents).to.deep.contain(
        new DeviceBatteryChangedDomainEvent({ aggregateId: device.id, previousBattery, currentBattery }),
      );
    });

    it('should not update the device battery when value is equal', function () {
      const previousBattery = new DeviceBattery(50);
      const device = new Device({ ...givenSomeDeviceProps(), battery: previousBattery });
      const currentBattery = new DeviceBattery(50);

      device.updateBattery(currentBattery);

      expect(device.battery).to.be.equal(previousBattery);
      expect(device.domainEvents).to.not.deep.contain(
        new DeviceBatteryChangedDomainEvent({ aggregateId: device.id, previousBattery, currentBattery }),
      );
    });
  });

  describe('#updateState()', function () {
    it('should update the device state', function () {
      const device = new Device(givenSomeDeviceProps());
      const state = new DeviceState(DeviceStateValue.Idle);

      device.updateState(state);

      expect(device.state).to.be.equal(state);
    });
  });

  describe('#updateMode()', function () {
    it('should update the device mode', function () {
      const device = new Device(givenSomeDeviceProps());
      const mode = new DeviceMode(DeviceModeValue.Spot);

      device.updateMode(mode);

      expect(device.mode).to.be.equal(mode);
    });
  });

  describe('#updateError()', function () {
    it('should update the device error', function () {
      const device = new Device(givenSomeDeviceProps());
      const error = new DeviceError(DeviceErrorValue.None);

      device.updateError(error);

      expect(device.error).to.be.equal(error);
    });
  });

  describe('#updateFanSpeed()', function () {
    it('should update the device fan speed', function () {
      const device = new Device(givenSomeDeviceProps());
      const fanSpeed = new DeviceFanSpeed(DeviceFanSpeedValue.Low);

      device.updateFanSpeed(fanSpeed);

      expect(device.fanSpeed).to.be.equal(fanSpeed);
    });
  });

  describe('#updateWaterLevel()', function () {
    it('should update the device water level', function () {
      const device = new Device(givenSomeDeviceProps());
      const waterLevel = new DeviceWaterLevel(DeviceWaterLevelValue.Low);

      device.updateWaterLevel(waterLevel);

      expect(device.waterLevel).to.be.equal(waterLevel);
    });
  });

  describe('#updateHasMopAttached()', function () {
    it('should update the device has mop attached', function () {
      const device = new Device({ ...givenSomeDeviceProps(), hasMopAttached: true });

      device.updateHasMopAttached(false);

      expect(device.hasMopAttached).to.be.equal(false);
    });
  });

  describe('#updateHasWaitingMap()', function () {
    it('should update the device has waiting map', function () {
      const device = new Device({ ...givenSomeDeviceProps(), hasWaitingMap: true });

      device.updateHasWaitingMap(false);

      expect(device.hasWaitingMap).to.be.equal(false);
    });
  });
});
