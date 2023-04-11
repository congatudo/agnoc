import { AggregateRoot, ArgumentInvalidException, ArgumentNotProvidedException, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceBatteryChangedDomainEvent } from '../domain-events/device-battery-changed.domain-event';
import { DeviceCleanWorkChangedDomainEvent } from '../domain-events/device-clean-work-changed.domain-event';
import { DeviceConnectedDomainEvent } from '../domain-events/device-connected.domain-event';
import { DeviceConsumablesChangedDomainEvent } from '../domain-events/device-consumables-changed.domain-event';
import { DeviceCreatedDomainEvent } from '../domain-events/device-created.domain-event';
import { DeviceErrorChangedDomainEvent } from '../domain-events/device-error-changed.domain-event';
import { DeviceFanSpeedChangedDomainEvent } from '../domain-events/device-fan-speed-changed.domain-event';
import { DeviceLockedDomainEvent } from '../domain-events/device-locked.domain-event';
import { DeviceMapChangedDomainEvent } from '../domain-events/device-map-changed.domain-event';
import { DeviceMapPendingDomainEvent } from '../domain-events/device-map-pending.domain-event';
import { DeviceModeChangedDomainEvent } from '../domain-events/device-mode-changed.domain-event';
import { DeviceMopAttachedDomainEvent } from '../domain-events/device-mop-attached.domain-event';
import { DeviceNetworkChangedDomainEvent } from '../domain-events/device-network-changed.domain-event';
import { DeviceOrdersChangedDomainEvent } from '../domain-events/device-orders-changed.domain-event';
import { DeviceSettingsChangedDomainEvent } from '../domain-events/device-settings-changed.domain-event';
import { DeviceStateChangedDomainEvent } from '../domain-events/device-state-changed.domain-event';
import { DeviceVersionChangedDomainEvent } from '../domain-events/device-version-changed.domain-event';
import { DeviceWaterLevelChangedDomainEvent } from '../domain-events/device-water-level-changed.domain-event';
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
    it('should update the device order', function () {
      const currentOrders = [new DeviceOrder({ ...givenSomeDeviceOrderProps(), id: new ID(2) })];
      const device = new Device({ ...givenSomeDeviceProps(), orders: undefined });

      device.updateOrders(currentOrders);

      expect(device.orders).to.be.equal(currentOrders);

      const event = device.domainEvents[1] as DeviceOrdersChangedDomainEvent;

      expect(event).to.be.instanceOf(DeviceOrdersChangedDomainEvent);
      expect(event.aggregateId).to.equal(device.id);
      expect(event.previousOrders).to.be.equal(undefined);
      expect(event.currentOrders).to.be.equal(currentOrders);
    });

    it('should not update the device order when value is equal', function () {
      const previousOrders = [new DeviceOrder({ ...givenSomeDeviceOrderProps(), id: new ID(1) })];
      const currentOrders = [new DeviceOrder({ ...givenSomeDeviceOrderProps(), id: new ID(1) })];
      const device = new Device({ ...givenSomeDeviceProps(), orders: previousOrders });

      device.updateOrders(currentOrders);

      expect(device.orders).to.be.equal(previousOrders);
      expect(device.domainEvents[1]).to.not.exist;
    });
  });

  describe('#updateConsumables()', function () {
    it('should update the device consumables', function () {
      const previousConsumables = [new DeviceConsumable(givenSomeDeviceConsumableProps())];
      const currentConsumables = [new DeviceConsumable(givenSomeDeviceConsumableProps())];
      const device = new Device({ ...givenSomeDeviceProps(), consumables: previousConsumables });

      device.updateConsumables(currentConsumables);

      expect(device.consumables).to.be.equal(currentConsumables);

      const event = device.domainEvents[1] as DeviceConsumablesChangedDomainEvent;

      expect(event).to.be.instanceOf(DeviceConsumablesChangedDomainEvent);
      expect(event.aggregateId).to.equal(device.id);
      expect(event.previousConsumables).to.be.equal(previousConsumables);
      expect(event.currentConsumables).to.be.equal(currentConsumables);
    });
  });

  describe('#updateMap()', function () {
    it('should update the device map', function () {
      const previousMap = new DeviceMap({ ...givenSomeDeviceMapProps(), id: new ID(1) });
      const currentMap = new DeviceMap({ ...givenSomeDeviceMapProps(), id: new ID(2) });
      const device = new Device({ ...givenSomeDeviceProps(), map: previousMap });

      device.updateMap(currentMap);

      expect(device.map).to.be.equal(currentMap);

      const event = device.domainEvents[1] as DeviceMapChangedDomainEvent;

      expect(event).to.be.instanceOf(DeviceMapChangedDomainEvent);
      expect(event.aggregateId).to.equal(device.id);
      expect(event.previousMap).to.be.equal(previousMap);
      expect(event.currentMap).to.be.equal(currentMap);
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
      const previousState = new DeviceState(DeviceStateValue.Idle);
      const currentState = new DeviceState(DeviceStateValue.Docked);
      const device = new Device({ ...givenSomeDeviceProps(), state: previousState });

      device.updateState(currentState);

      expect(device.state).to.be.equal(currentState);

      const event = device.domainEvents[1] as DeviceStateChangedDomainEvent;

      expect(event).to.be.instanceOf(DeviceStateChangedDomainEvent);
      expect(event.aggregateId).to.equal(device.id);
      expect(event.previousState).to.be.equal(previousState);
      expect(event.currentState).to.be.equal(currentState);
    });

    it('should not update the device state when value is equal', function () {
      const previousState = new DeviceState(DeviceStateValue.Idle);
      const currentState = new DeviceState(DeviceStateValue.Idle);
      const device = new Device({ ...givenSomeDeviceProps(), state: previousState });

      device.updateState(currentState);

      expect(device.state).to.be.equal(previousState);
      expect(device.domainEvents[1]).to.not.exist;
    });
  });

  describe('#updateMode()', function () {
    it('should update the device mode', function () {
      const previousMode = new DeviceMode(DeviceModeValue.None);
      const currentMode = new DeviceMode(DeviceModeValue.Mop);
      const device = new Device({ ...givenSomeDeviceProps(), mode: previousMode });

      device.updateMode(currentMode);

      expect(device.mode).to.be.equal(currentMode);

      const event = device.domainEvents[1] as DeviceModeChangedDomainEvent;

      expect(event).to.be.instanceOf(DeviceModeChangedDomainEvent);
      expect(event.aggregateId).to.equal(device.id);
      expect(event.previousMode).to.be.equal(previousMode);
      expect(event.currentMode).to.be.equal(currentMode);
    });

    it('should not update the device mode when value is equal', function () {
      const previousMode = new DeviceMode(DeviceModeValue.None);
      const currentMode = new DeviceMode(DeviceModeValue.None);
      const device = new Device({ ...givenSomeDeviceProps(), mode: previousMode });

      device.updateMode(currentMode);

      expect(device.mode).to.be.equal(previousMode);
      expect(device.domainEvents[1]).to.not.exist;
    });
  });

  describe('#updateError()', function () {
    it('should update the device error', function () {
      const previousError = new DeviceError(DeviceErrorValue.None);
      const currentError = new DeviceError(DeviceErrorValue.WheelUp);
      const device = new Device({ ...givenSomeDeviceProps(), error: previousError });

      device.updateError(currentError);

      expect(device.error).to.be.equal(currentError);

      const event = device.domainEvents[1] as DeviceErrorChangedDomainEvent;

      expect(event).to.be.instanceOf(DeviceErrorChangedDomainEvent);
      expect(event.aggregateId).to.equal(device.id);
      expect(event.previousError).to.be.equal(previousError);
      expect(event.currentError).to.be.equal(currentError);
    });

    it('should not update the device error when value is equal', function () {
      const previousError = new DeviceError(DeviceErrorValue.None);
      const currentError = new DeviceError(DeviceErrorValue.None);
      const device = new Device({ ...givenSomeDeviceProps(), error: previousError });

      device.updateError(currentError);

      expect(device.error).to.be.equal(previousError);
      expect(device.domainEvents[1]).to.not.exist;
    });
  });

  describe('#updateFanSpeed()', function () {
    it('should update the device fanSpeed', function () {
      const previousFanSpeed = new DeviceFanSpeed(DeviceFanSpeedValue.Off);
      const currentFanSpeed = new DeviceFanSpeed(DeviceFanSpeedValue.Low);
      const device = new Device({ ...givenSomeDeviceProps(), fanSpeed: previousFanSpeed });

      device.updateFanSpeed(currentFanSpeed);

      expect(device.fanSpeed).to.be.equal(currentFanSpeed);

      const event = device.domainEvents[1] as DeviceFanSpeedChangedDomainEvent;

      expect(event).to.be.instanceOf(DeviceFanSpeedChangedDomainEvent);
      expect(event.aggregateId).to.equal(device.id);
      expect(event.previousFanSpeed).to.be.equal(previousFanSpeed);
      expect(event.currentFanSpeed).to.be.equal(currentFanSpeed);
    });

    it('should not update the device fanSpeed when value is equal', function () {
      const previousFanSpeed = new DeviceFanSpeed(DeviceFanSpeedValue.Off);
      const currentFanSpeed = new DeviceFanSpeed(DeviceFanSpeedValue.Off);
      const device = new Device({ ...givenSomeDeviceProps(), fanSpeed: previousFanSpeed });

      device.updateFanSpeed(currentFanSpeed);

      expect(device.fanSpeed).to.be.equal(previousFanSpeed);
      expect(device.domainEvents[1]).to.not.exist;
    });
  });

  describe('#updateWaterLevel()', function () {
    it('should update the device waterLevel', function () {
      const previousWaterLevel = new DeviceWaterLevel(DeviceWaterLevelValue.Off);
      const currentWaterLevel = new DeviceWaterLevel(DeviceWaterLevelValue.Low);
      const device = new Device({ ...givenSomeDeviceProps(), waterLevel: previousWaterLevel });

      device.updateWaterLevel(currentWaterLevel);

      expect(device.waterLevel).to.be.equal(currentWaterLevel);

      const event = device.domainEvents[1] as DeviceWaterLevelChangedDomainEvent;

      expect(event).to.be.instanceOf(DeviceWaterLevelChangedDomainEvent);
      expect(event.aggregateId).to.equal(device.id);
      expect(event.previousWaterLevel).to.be.equal(previousWaterLevel);
      expect(event.currentWaterLevel).to.be.equal(currentWaterLevel);
    });

    it('should not update the device waterLevel when value is equal', function () {
      const previousWaterLevel = new DeviceWaterLevel(DeviceWaterLevelValue.Off);
      const currentWaterLevel = new DeviceWaterLevel(DeviceWaterLevelValue.Off);
      const device = new Device({ ...givenSomeDeviceProps(), waterLevel: previousWaterLevel });

      device.updateWaterLevel(currentWaterLevel);

      expect(device.waterLevel).to.be.equal(previousWaterLevel);
      expect(device.domainEvents[1]).to.not.exist;
    });
  });

  describe('#updateHasMopAttached()', function () {
    it('should update the device hasMopAttached', function () {
      const device = new Device({ ...givenSomeDeviceProps(), hasMopAttached: false });

      device.updateHasMopAttached(true);

      expect(device.hasMopAttached).to.be.equal(true);

      const event = device.domainEvents[1] as DeviceMopAttachedDomainEvent;

      expect(event).to.be.instanceOf(DeviceMopAttachedDomainEvent);
      expect(event.aggregateId).to.equal(device.id);
      expect(event.isAttached).to.be.equal(true);
    });

    it('should not update the device hasMopAttached when value is equal', function () {
      const device = new Device({ ...givenSomeDeviceProps(), hasMopAttached: true });

      device.updateHasMopAttached(true);

      expect(device.hasMopAttached).to.be.equal(true);
      expect(device.domainEvents[1]).to.not.exist;
    });
  });

  describe('#updateHasWaitingMap()', function () {
    it('should update the device hasWaitingMap', function () {
      const device = new Device({ ...givenSomeDeviceProps(), hasWaitingMap: false });

      device.updateHasWaitingMap(true);

      expect(device.hasWaitingMap).to.be.equal(true);

      const event = device.domainEvents[1] as DeviceMapPendingDomainEvent;

      expect(event).to.be.instanceOf(DeviceMapPendingDomainEvent);
      expect(event.aggregateId).to.equal(device.id);
      expect(event.isPending).to.be.equal(true);
    });

    it('should not update the device hasWaitingMap when value is equal', function () {
      const device = new Device({ ...givenSomeDeviceProps(), hasWaitingMap: true });

      device.updateHasWaitingMap(true);

      expect(device.hasWaitingMap).to.be.equal(true);
      expect(device.domainEvents[1]).to.not.exist;
    });
  });
});
