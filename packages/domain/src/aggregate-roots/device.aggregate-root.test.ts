import { AggregateRoot, ArgumentInvalidException, ArgumentNotProvidedException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceBatteryChangedDomainEvent } from '../domain-events/device-battery-changed.domain-event';
import { DeviceCleanWorkChangedDomainEvent } from '../domain-events/device-clean-work-changed.domain-event';
import { DeviceConnectedDomainEvent } from '../domain-events/device-connected.domain-event';
import { DeviceCreatedDomainEvent } from '../domain-events/device-created.domain-event';
import { DeviceLockedDomainEvent } from '../domain-events/device-locked.domain-event';
import { DeviceNetworkChangedDomainEvent } from '../domain-events/device-network-changed.domain-event';
import { DeviceSettingsChangedDomainEvent } from '../domain-events/device-settings-changed.domain-event';
import { DeviceVersionChangedDomainEvent } from '../domain-events/device-version-changed.domain-event';
import { CleanSize } from '../domain-primitives/clean-size.domain-primitive';
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
  givenSomeDeviceVersionProps,
  givenSomeDeviceNetworkProps,
} from '../test-support';
import { DeviceCleanWork } from '../value-objects/device-clean-work.value-object';
import { DeviceConsumable } from '../value-objects/device-consumable.value-object';
import { DeviceNetwork } from '../value-objects/device-network.value-object';
import { DeviceSetting } from '../value-objects/device-setting.value-object';
import { DeviceSettings } from '../value-objects/device-settings.value-object';
import { DeviceVersion } from '../value-objects/device-version.value-object';
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

    const event = device.domainEvents[0] as DeviceCreatedDomainEvent;

    expect(event).to.be.instanceOf(DeviceCreatedDomainEvent);
    expect(event.aggregateId).to.be.equal(device.id);
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

  it("should throw an error when 'settings' is not a DeviceSettings", function () {
    // @ts-expect-error - invalid property
    expect(() => new Device({ ...givenSomeDeviceProps(), settings: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'settings' of Device is not an instance of DeviceSettings`,
    );
  });

  it("should throw an error when 'currentCleanWork' is not a DeviceCleanWork", function () {
    // @ts-expect-error - invalid property
    expect(() => new Device({ ...givenSomeDeviceProps(), currentCleanWork: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'currentCleanWork' of Device is not an instance of DeviceCleanWork`,
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

  it("should throw an error when 'network' is not a DeviceNetwork", function () {
    // @ts-expect-error - invalid property
    expect(() => new Device({ ...givenSomeDeviceProps(), network: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'network' of Device is not an instance of DeviceNetwork`,
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
    it('should set the device as connected', function () {
      const device = new Device({ ...givenSomeDeviceProps(), isConnected: false });

      device.setAsConnected();

      expect(device.isConnected).to.be.true;

      const event = device.domainEvents[1] as DeviceConnectedDomainEvent;

      expect(event).to.be.instanceOf(DeviceConnectedDomainEvent);
      expect(event.aggregateId).to.equal(device.id);
    });

    it('should not set the device as connected when is connected', function () {
      const device = new Device({ ...givenSomeDeviceProps(), isConnected: true });

      device.setAsConnected();

      expect(device.isConnected).to.be.true;

      expect(device.domainEvents[1]).to.not.be.instanceOf(DeviceConnectedDomainEvent);
    });
  });

  describe('#setAsLocked()', function () {
    it('should set the device as locked', function () {
      const device = new Device({ ...givenSomeDeviceProps(), isLocked: false });

      device.setAsLocked();

      expect(device.isLocked).to.be.true;

      const event = device.domainEvents[1] as DeviceLockedDomainEvent;

      expect(event).to.be.instanceOf(DeviceLockedDomainEvent);
      expect(event.aggregateId).to.equal(device.id);
    });

    it('should not set the device as locked', function () {
      const device = new Device({ ...givenSomeDeviceProps(), isLocked: true });

      device.setAsLocked();

      expect(device.isLocked).to.be.true;
      expect(device.domainEvents[1]).to.not.be.instanceOf(DeviceLockedDomainEvent);
    });
  });

  describe('#updateVersion()', function () {
    it('should update the device version', function () {
      const previousVersion = new DeviceVersion({ ...givenSomeDeviceVersionProps(), software: '1.0.0' });
      const currentVersion = new DeviceVersion({ ...givenSomeDeviceVersionProps(), software: '1.0.1' });
      const device = new Device({ ...givenSomeDeviceProps(), version: previousVersion });

      device.updateVersion(currentVersion);

      expect(device.version).to.be.equal(currentVersion);

      const event = device.domainEvents[1] as DeviceVersionChangedDomainEvent;

      expect(event).to.be.instanceOf(DeviceVersionChangedDomainEvent);
      expect(event.aggregateId).to.equal(device.id);
      expect(event.previousVersion).to.be.equal(previousVersion);
      expect(event.currentVersion).to.be.equal(currentVersion);
    });

    it('should not update the device version when value is equal', function () {
      const previousVersion = new DeviceVersion(givenSomeDeviceVersionProps());
      const currentVersion = new DeviceVersion(givenSomeDeviceVersionProps());
      const device = new Device({ ...givenSomeDeviceProps(), version: previousVersion });

      device.updateVersion(currentVersion);

      expect(device.version).to.be.equal(previousVersion);
      expect(device.domainEvents[1]).to.not.exist;
    });
  });

  describe('#updateSettings()', function () {
    it('should update the device settings', function () {
      const previousSettings = new DeviceSettings({
        ...givenSomeDeviceSettingsProps(),
        ecoMode: new DeviceSetting({ isEnabled: false }),
      });
      const currentSettings = new DeviceSettings({
        ...givenSomeDeviceSettingsProps(),
        ecoMode: new DeviceSetting({ isEnabled: true }),
      });
      const device = new Device({ ...givenSomeDeviceProps(), settings: previousSettings });

      device.updateSettings(currentSettings);

      expect(device.settings).to.be.equal(currentSettings);

      const event = device.domainEvents[1] as DeviceSettingsChangedDomainEvent;

      expect(event).to.be.instanceOf(DeviceSettingsChangedDomainEvent);
      expect(event.aggregateId).to.equal(device.id);
      expect(event.previousSettings).to.be.equal(previousSettings);
      expect(event.currentSettings).to.be.equal(currentSettings);
    });

    it('should not update the device settings when value is equal', function () {
      const previousSettings = new DeviceSettings(givenSomeDeviceSettingsProps());
      const currentSettings = new DeviceSettings(givenSomeDeviceSettingsProps());
      const device = new Device({ ...givenSomeDeviceProps(), settings: previousSettings });

      device.updateSettings(currentSettings);

      expect(device.settings).to.be.equal(previousSettings);
      expect(device.domainEvents[1]).to.not.exist;
    });
  });

  describe('#updateCurrentCleanWork()', function () {
    it('should update the device cleanWork', function () {
      const previousCleanWork = new DeviceCleanWork({ ...givenSomeDeviceCleanWorkProps(), size: new CleanSize(1) });
      const currentCleanWork = new DeviceCleanWork({ ...givenSomeDeviceCleanWorkProps(), size: new CleanSize(2) });
      const device = new Device({ ...givenSomeDeviceProps(), currentCleanWork: previousCleanWork });

      device.updateCurrentCleanWork(currentCleanWork);

      expect(device.currentCleanWork).to.be.equal(currentCleanWork);

      const event = device.domainEvents[1] as DeviceCleanWorkChangedDomainEvent;

      expect(event).to.be.instanceOf(DeviceCleanWorkChangedDomainEvent);
      expect(event.aggregateId).to.equal(device.id);
      expect(event.previousCleanWork).to.be.equal(previousCleanWork);
      expect(event.currentCleanWork).to.be.equal(currentCleanWork);
    });

    it('should not update the device cleanWork when value is equal', function () {
      const previousCleanWork = new DeviceCleanWork(givenSomeDeviceCleanWorkProps());
      const currentCleanWork = new DeviceCleanWork(givenSomeDeviceCleanWorkProps());
      const device = new Device({ ...givenSomeDeviceProps(), currentCleanWork: previousCleanWork });

      device.updateCurrentCleanWork(currentCleanWork);

      expect(device.currentCleanWork).to.be.equal(previousCleanWork);
      expect(device.domainEvents[1]).to.not.exist;
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

  describe('#updateNetwork()', function () {
    it('should update the device network', function () {
      const previousNetwork = new DeviceNetwork({ ...givenSomeDeviceNetworkProps(), port: 1 });
      const currentNetwork = new DeviceNetwork({ ...givenSomeDeviceNetworkProps(), port: 2 });
      const device = new Device({ ...givenSomeDeviceProps(), network: previousNetwork });

      device.updateNetwork(currentNetwork);

      expect(device.network).to.be.equal(currentNetwork);

      const event = device.domainEvents[1] as DeviceNetworkChangedDomainEvent;

      expect(event).to.be.instanceOf(DeviceNetworkChangedDomainEvent);
      expect(event.aggregateId).to.equal(device.id);
      expect(event.previousNetwork).to.be.equal(previousNetwork);
      expect(event.currentNetwork).to.be.equal(currentNetwork);
    });

    it('should not update the device network when value is equal', function () {
      const previousNetwork = new DeviceNetwork(givenSomeDeviceNetworkProps());
      const currentNetwork = new DeviceNetwork(givenSomeDeviceNetworkProps());
      const device = new Device({ ...givenSomeDeviceProps(), network: previousNetwork });

      device.updateNetwork(currentNetwork);

      expect(device.network).to.be.equal(previousNetwork);
      expect(device.domainEvents[1]).to.not.exist;
    });
  });

  describe('#updateBattery()', function () {
    it('should update the device battery', function () {
      const previousBattery = new DeviceBattery(60);
      const currentBattery = new DeviceBattery(50);
      const device = new Device({ ...givenSomeDeviceProps(), battery: previousBattery });

      device.updateBattery(currentBattery);

      expect(device.battery).to.be.equal(currentBattery);

      const event = device.domainEvents[1] as DeviceBatteryChangedDomainEvent;

      expect(event).to.be.instanceOf(DeviceBatteryChangedDomainEvent);
      expect(event.aggregateId).to.equal(device.id);
      expect(event.previousBattery).to.be.equal(previousBattery);
      expect(event.currentBattery).to.be.equal(currentBattery);
    });

    it('should not update the device battery when value is equal', function () {
      const previousBattery = new DeviceBattery(50);
      const currentBattery = new DeviceBattery(50);
      const device = new Device({ ...givenSomeDeviceProps(), battery: previousBattery });

      device.updateBattery(currentBattery);

      expect(device.battery).to.be.equal(previousBattery);
      expect(device.domainEvents[1]).to.not.exist;
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
