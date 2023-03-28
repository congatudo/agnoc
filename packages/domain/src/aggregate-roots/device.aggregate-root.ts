import { AggregateRoot, ID, symmetricDifference } from '@agnoc/toolkit';
import { DeviceBatteryChangedDomainEvent } from '../domain-events/device-battery-changed.domain-event';
import { DeviceCleanWorkChangedDomainEvent } from '../domain-events/device-clean-work-changed.domain-event';
import { DeviceConnectedDomainEvent } from '../domain-events/device-connected.domain-event';
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
import { DeviceBattery } from '../domain-primitives/device-battery.domain-primitive';
import { DeviceError } from '../domain-primitives/device-error.domain-primitive';
import { DeviceFanSpeed } from '../domain-primitives/device-fan-speed.domain-primitive';
import { DeviceMode } from '../domain-primitives/device-mode.domain-primitive';
import { DeviceState } from '../domain-primitives/device-state.domain-primitive';
import { DeviceWaterLevel } from '../domain-primitives/device-water-level.domain-primitive';
import { DeviceMap } from '../entities/device-map.entity';
import { DeviceOrder } from '../entities/device-order.entity';
import { DeviceCleanWork } from '../value-objects/device-clean-work.value-object';
import { DeviceConsumable } from '../value-objects/device-consumable.value-object';
import { DeviceNetwork } from '../value-objects/device-network.value-object';
import { DeviceSettings } from '../value-objects/device-settings.value-object';
import { DeviceSystem } from '../value-objects/device-system.value-object';
import { DeviceVersion } from '../value-objects/device-version.value-object';
import type { EntityProps } from '@agnoc/toolkit';

/** Describes the properties of a device. */
export interface DeviceProps extends EntityProps {
  /** The user id. */
  userId: ID;
  /** The device system. */
  system: DeviceSystem;
  /** The device version. */
  version: DeviceVersion;
  /** The device battery. */
  battery: DeviceBattery;
  /** Whether the device is connected. */
  isConnected: boolean;
  /** Whether the device is locked. */
  isLocked: boolean;
  /** The device settings. */
  settings?: DeviceSettings;
  /** The device current clean. */
  currentCleanWork?: DeviceCleanWork;
  /** The device orders. */
  orders?: DeviceOrder[];
  /** The device consumables. */
  consumables?: DeviceConsumable[];
  /** The device map. */
  map?: DeviceMap;
  /** The device network. */
  network?: DeviceNetwork;
  /** The device state. */
  state?: DeviceState;
  /** The device mode. */
  mode?: DeviceMode;
  /** The device error. */
  error?: DeviceError;
  /** The device fan speed. */
  fanSpeed?: DeviceFanSpeed;
  /** The device water level. */
  waterLevel?: DeviceWaterLevel;
  /** whether the device has a mop attached. */
  hasMopAttached?: boolean;
  /** Whether the device has a waiting map. */
  hasWaitingMap?: boolean;
}

/** Describes a device. */
export class Device extends AggregateRoot<DeviceProps> {
  constructor(props: DeviceProps) {
    super(props);
    this.addEvent(new DeviceCreatedDomainEvent({ aggregateId: this.id }));
  }

  /** Returns the user id. */
  get userId(): ID {
    return this.props.userId;
  }

  /** Returns the device system. */
  get system(): DeviceSystem {
    return this.props.system;
  }

  /** Returns the device battery. */
  get battery(): DeviceBattery {
    return this.props.battery;
  }

  /** Returns whether the device is connected. */
  get isConnected(): boolean {
    return this.props.isConnected;
  }

  /** Returns whether the device is locked. */
  get isLocked(): boolean {
    return this.props.isLocked;
  }

  /** Returns the device version. */
  get version(): DeviceVersion {
    return this.props.version;
  }

  /** Returns the device settings. */
  get settings(): DeviceSettings | undefined {
    return this.props.settings;
  }

  /** Returns the device current clean. */
  get currentCleanWork(): DeviceCleanWork | undefined {
    return this.props.currentCleanWork;
  }

  /** Returns the device orders. */
  get orders(): DeviceOrder[] | undefined {
    return this.props.orders;
  }

  /** Returns the device consumables. */
  get consumables(): DeviceConsumable[] | undefined {
    return this.props.consumables;
  }

  /** Returns the device map. */
  get map(): DeviceMap | undefined {
    return this.props.map;
  }

  /** Returns the device network. */
  get network(): DeviceNetwork | undefined {
    return this.props.network;
  }

  /** Returns the device state. */
  get state(): DeviceState | undefined {
    return this.props.state;
  }

  /** Returns the device mode. */
  get mode(): DeviceMode | undefined {
    return this.props.mode;
  }

  /** Returns the device error. */
  get error(): DeviceError | undefined {
    return this.props.error;
  }

  /** Returns the device fan speed. */
  get fanSpeed(): DeviceFanSpeed | undefined {
    return this.props.fanSpeed;
  }

  /** Returns the device water level. */
  get waterLevel(): DeviceWaterLevel | undefined {
    return this.props.waterLevel;
  }

  /** Returns whether the device has a mop attached. */
  get hasMopAttached(): boolean {
    return Boolean(this.props.hasMopAttached);
  }

  /** Returns whether the device has a waiting map. */
  get hasWaitingMap(): boolean {
    return Boolean(this.props.hasWaitingMap);
  }

  /** Sets the device as connected. */
  setAsConnected(): void {
    if (this.isConnected) {
      return;
    }

    this.addEvent(new DeviceConnectedDomainEvent({ aggregateId: this.id }));
    this.props.isConnected = true;
  }

  /** Sets the device as connected. */
  setAsLocked(): void {
    if (this.isLocked) {
      return;
    }

    this.addEvent(new DeviceLockedDomainEvent({ aggregateId: this.id }));
    this.props.isLocked = true;
  }

  /** Updates the device version. */
  updateVersion(version: DeviceVersion): void {
    if (version.equals(this.version)) {
      return;
    }

    this.validateDefinedProp({ version }, 'version');
    this.validateInstanceProp({ version }, 'version', DeviceVersion);
    this.addEvent(
      new DeviceVersionChangedDomainEvent({
        aggregateId: this.id,
        previousVersion: this.version,
        currentVersion: version,
      }),
    );
    this.props.version = version;
  }

  /** Updates the device settings. */
  updateSettings(settings: DeviceSettings): void {
    if (settings.equals(this.settings)) {
      return;
    }

    this.validateDefinedProp({ settings }, 'settings');
    this.validateInstanceProp({ settings }, 'settings', DeviceSettings);
    this.addEvent(
      new DeviceSettingsChangedDomainEvent({
        aggregateId: this.id,
        previousSettings: this.settings,
        currentSettings: settings,
      }),
    );
    this.props.settings = settings;
  }

  /** Updates the device current clean. */
  updateCurrentCleanWork(currentCleanWork: DeviceCleanWork): void {
    if (currentCleanWork.equals(this.currentCleanWork)) {
      return;
    }

    this.validateDefinedProp({ currentCleanWork }, 'currentCleanWork');
    this.validateInstanceProp({ currentCleanWork }, 'currentCleanWork', DeviceCleanWork);
    this.addEvent(
      new DeviceCleanWorkChangedDomainEvent({
        aggregateId: this.id,
        previousCleanWork: this.currentCleanWork,
        currentCleanWork,
      }),
    );
    this.props.currentCleanWork = currentCleanWork;
  }

  /** Updates the device orders. */
  updateOrders(orders: DeviceOrder[]): void {
    const previousOrderIds = this.orders?.map((order) => order.id.value) ?? [];
    const currentOrderIds = orders.map((order) => order.id.value);
    const diff = symmetricDifference(previousOrderIds, currentOrderIds);

    if (diff.length === 0) {
      return;
    }

    this.validateDefinedProp({ orders }, 'orders');
    this.validateArrayProp({ orders }, 'orders', DeviceOrder);
    this.addEvent(
      new DeviceOrdersChangedDomainEvent({
        aggregateId: this.id,
        previousOrders: this.orders,
        currentOrders: orders,
      }),
    );
    this.props.orders = orders;
  }

  /** Updates the device consumables. */
  updateConsumables(consumables?: DeviceConsumable[]): void {
    this.validateArrayProp({ consumables }, 'consumables', DeviceConsumable);
    this.props.consumables = consumables;
  }

  /** Updates the device map. */
  updateMap(map: DeviceMap): void {
    // TODO: prevent map changed event if the map is not changed
    this.validateDefinedProp({ map }, 'map');
    this.validateInstanceProp({ map }, 'map', DeviceMap);
    this.addEvent(
      new DeviceMapChangedDomainEvent({
        aggregateId: this.id,
        previousMap: this.map,
        currentMap: map,
      }),
    );
    this.props.map = map;
  }

  /** Updates the device network. */
  updateNetwork(network: DeviceNetwork): void {
    if (network.equals(this.network)) {
      return;
    }

    this.validateDefinedProp({ network }, 'network');
    this.validateInstanceProp({ network }, 'network', DeviceNetwork);
    this.addEvent(
      new DeviceNetworkChangedDomainEvent({
        aggregateId: this.id,
        previousNetwork: this.props.network,
        currentNetwork: network,
      }),
    );
    this.props.network = network;
  }

  /** Updates the device battery. */
  updateBattery(battery: DeviceBattery): void {
    if (battery.equals(this.battery)) {
      return;
    }

    this.validateDefinedProp({ battery }, 'battery');
    this.validateInstanceProp({ battery }, 'battery', DeviceBattery);
    this.addEvent(
      new DeviceBatteryChangedDomainEvent({
        aggregateId: this.id,
        previousBattery: this.props.battery,
        currentBattery: battery,
      }),
    );
    this.props.battery = battery;
  }

  /** Updates the device state. */
  updateState(state: DeviceState): void {
    if (state.equals(this.state)) {
      return;
    }

    this.validateDefinedProp({ state }, 'state');
    this.validateInstanceProp({ state }, 'state', DeviceState);
    this.addEvent(
      new DeviceStateChangedDomainEvent({
        aggregateId: this.id,
        previousState: this.state,
        currentState: state,
      }),
    );
    this.props.state = state;
  }

  /** Updates the device mode. */
  updateMode(mode: DeviceMode): void {
    if (mode.equals(this.mode)) {
      return;
    }

    this.validateDefinedProp({ mode }, 'mode');
    this.validateInstanceProp({ mode }, 'mode', DeviceMode);
    this.addEvent(
      new DeviceModeChangedDomainEvent({
        aggregateId: this.id,
        previousMode: this.mode,
        currentMode: mode,
      }),
    );
    this.props.mode = mode;
  }

  /** Updates the device error. */
  updateError(error: DeviceError): void {
    if (error.equals(this.error)) {
      return;
    }

    this.validateDefinedProp({ error }, 'error');
    this.validateInstanceProp({ error }, 'error', DeviceError);
    this.addEvent(
      new DeviceErrorChangedDomainEvent({
        aggregateId: this.id,
        previousError: this.error,
        currentError: error,
      }),
    );
    this.props.error = error;
  }

  /** Updates the device fan speed. */
  updateFanSpeed(fanSpeed: DeviceFanSpeed): void {
    if (fanSpeed.equals(this.fanSpeed)) {
      return;
    }

    this.validateDefinedProp({ fanSpeed }, 'fanSpeed');
    this.validateInstanceProp({ fanSpeed }, 'fanSpeed', DeviceFanSpeed);
    this.addEvent(
      new DeviceFanSpeedChangedDomainEvent({
        aggregateId: this.id,
        previousFanSpeed: this.fanSpeed,
        currentFanSpeed: fanSpeed,
      }),
    );
    this.props.fanSpeed = fanSpeed;
  }

  /** Updates the device water level. */
  updateWaterLevel(waterLevel: DeviceWaterLevel): void {
    if (waterLevel.equals(this.waterLevel)) {
      return;
    }

    this.validateDefinedProp({ waterLevel }, 'waterLevel');
    this.validateInstanceProp({ waterLevel }, 'waterLevel', DeviceWaterLevel);
    this.addEvent(
      new DeviceWaterLevelChangedDomainEvent({
        aggregateId: this.id,
        previousWaterLevel: this.waterLevel,
        currentWaterLevel: waterLevel,
      }),
    );
    this.props.waterLevel = waterLevel;
  }

  /** Updates whether the device has a mop attached. */
  updateHasMopAttached(hasMopAttached: boolean): void {
    if (hasMopAttached === this.hasMopAttached) {
      return;
    }

    this.validateDefinedProp({ hasMopAttached }, 'hasMopAttached');
    this.validateTypeProp({ hasMopAttached }, 'hasMopAttached', 'boolean');
    this.addEvent(
      new DeviceMopAttachedDomainEvent({
        aggregateId: this.id,
        isAttached: hasMopAttached,
      }),
    );
    this.props.hasMopAttached = hasMopAttached;
  }

  /** Updates whether the device has a waiting map. */
  updateHasWaitingMap(hasWaitingMap: boolean): void {
    if (hasWaitingMap === this.hasWaitingMap) {
      return;
    }

    this.validateDefinedProp({ hasWaitingMap }, 'hasWaitingMap');
    this.validateTypeProp({ hasWaitingMap }, 'hasWaitingMap', 'boolean');
    this.addEvent(
      new DeviceMapPendingDomainEvent({
        aggregateId: this.id,
        isPending: hasWaitingMap,
      }),
    );
    this.props.hasWaitingMap = hasWaitingMap;
  }

  protected validate(props: DeviceProps): void {
    const keys: (keyof DeviceProps)[] = ['userId', 'system', 'version', 'battery', 'isConnected', 'isLocked'];

    keys.forEach((prop) => {
      this.validateDefinedProp(props, prop);
    });

    this.validateInstanceProp(props, 'userId', ID);
    this.validateInstanceProp(props, 'system', DeviceSystem);
    this.validateInstanceProp(props, 'version', DeviceVersion);
    this.validateTypeProp(props, 'isConnected', 'boolean');
    this.validateTypeProp(props, 'isLocked', 'boolean');
    this.validateInstanceProp(props, 'settings', DeviceSettings);
    this.validateInstanceProp(props, 'currentCleanWork', DeviceCleanWork);
    this.validateArrayProp(props, 'orders', DeviceOrder);
    this.validateArrayProp(props, 'consumables', DeviceConsumable);
    this.validateInstanceProp(props, 'map', DeviceMap);
    this.validateInstanceProp(props, 'network', DeviceNetwork);
    this.validateInstanceProp(props, 'battery', DeviceBattery);
    this.validateInstanceProp(props, 'state', DeviceState);
    this.validateInstanceProp(props, 'mode', DeviceMode);
    this.validateInstanceProp(props, 'error', DeviceError);
    this.validateInstanceProp(props, 'fanSpeed', DeviceFanSpeed);
    this.validateInstanceProp(props, 'waterLevel', DeviceWaterLevel);
    this.validateTypeProp(props, 'hasMopAttached', 'boolean');
    this.validateTypeProp(props, 'hasWaitingMap', 'boolean');
  }
}
