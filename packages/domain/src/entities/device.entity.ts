import { AggregateRoot, ID } from '@agnoc/toolkit';
import { DeviceConnectedDomainEvent } from '../domain-events/device-connected.domain-event';
import { DeviceLockedDomainEvent } from '../domain-events/device-locked.domain-event';
import { DeviceBattery } from '../domain-primitives/device-battery.domain-primitive';
import { DeviceError } from '../domain-primitives/device-error.domain-primitive';
import { DeviceFanSpeed } from '../domain-primitives/device-fan-speed.domain-primitive';
import { DeviceMode } from '../domain-primitives/device-mode.domain-primitive';
import { DeviceState } from '../domain-primitives/device-state.domain-primitive';
import { DeviceWaterLevel } from '../domain-primitives/device-water-level.domain-primitive';
import { DeviceCleanWork } from '../value-objects/device-clean-work.value-object';
import { DeviceConsumable } from '../value-objects/device-consumable.value-object';
import { DeviceSettings } from '../value-objects/device-settings.value-object';
import { DeviceSystem } from '../value-objects/device-system.value-object';
import { DeviceVersion } from '../value-objects/device-version.value-object';
import { DeviceWlan } from '../value-objects/device-wlan.value-object';
import { DeviceMap } from './device-map.entity';
import { DeviceOrder } from './device-order.entity';
import type { EntityProps } from '@agnoc/toolkit';

/** Describes the properties of a device. */
export interface DeviceProps extends EntityProps {
  /** The user id. */
  userId: ID;
  /** The device system. */
  system: DeviceSystem;
  /** The device version. */
  version: DeviceVersion;
  /** Whether the device is connected. */
  isConnected?: boolean;
  /** Whether the device is locked. */
  isLocked?: boolean;
  /** The device settings. */
  config?: DeviceSettings;
  /** The device current clean. */
  currentClean?: DeviceCleanWork;
  /** The device orders. */
  orders?: DeviceOrder[];
  /** The device consumables. */
  consumables?: DeviceConsumable[];
  /** The device map. */
  map?: DeviceMap;
  /** The device wlan. */
  wlan?: DeviceWlan;
  /** The device battery. */
  battery?: DeviceBattery;
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
  /** Returns the user id. */
  get userId(): ID {
    return this.props.userId;
  }

  /** Returns the device system. */
  get system(): DeviceSystem {
    return this.props.system;
  }

  /** Returns whether the device is connected. */
  get isConnected(): boolean {
    return this.props.isConnected ?? false;
  }

  /** Returns whether the device is locked. */
  get isLocked(): boolean {
    return this.props.isLocked ?? false;
  }

  /** Returns the device version. */
  get version(): DeviceVersion {
    return this.props.version;
  }

  /** Returns the device settings. */
  get config(): DeviceSettings | undefined {
    return this.props.config;
  }

  /** Returns the device current clean. */
  get currentClean(): DeviceCleanWork | undefined {
    return this.props.currentClean;
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

  /** Returns the device wlan. */
  get wlan(): DeviceWlan | undefined {
    return this.props.wlan;
  }

  /** Returns the device battery. */
  get battery(): DeviceBattery | undefined {
    return this.props.battery;
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
    this.props.isConnected = true;
    this.addEvent(new DeviceConnectedDomainEvent({ aggregateId: this.id }));
  }

  /** Sets the device as connected. */
  setAsLocked(): void {
    this.props.isLocked = true;
    this.addEvent(new DeviceLockedDomainEvent({ aggregateId: this.id }));
  }

  /** Updates the device system. */
  updateSystem(system: DeviceSystem): void {
    this.validateDefinedProp({ system }, 'system');
    this.validateInstanceProp({ system }, 'system', DeviceSystem);
    this.props.system = system;
  }

  /** Updates the device version. */
  updateVersion(version: DeviceVersion): void {
    this.validateDefinedProp({ version }, 'version');
    this.validateInstanceProp({ version }, 'version', DeviceVersion);
    this.props.version = version;
  }

  /** Updates the device settings. */
  updateConfig(config?: DeviceSettings): void {
    this.validateInstanceProp({ config }, 'config', DeviceSettings);
    this.props.config = config;
  }

  /** Updates the device current clean. */
  updateCurrentClean(currentClean?: DeviceCleanWork): void {
    this.validateInstanceProp({ currentClean }, 'currentClean', DeviceCleanWork);
    this.props.currentClean = currentClean;
  }

  /** Updates the device orders. */
  updateOrders(orders?: DeviceOrder[]): void {
    this.validateArrayProp({ orders }, 'orders', DeviceOrder);
    this.props.orders = orders;
  }

  /** Updates the device consumables. */
  updateConsumables(consumables?: DeviceConsumable[]): void {
    this.validateArrayProp({ consumables }, 'consumables', DeviceConsumable);
    this.props.consumables = consumables;
  }

  /** Updates the device map. */
  updateMap(map?: DeviceMap): void {
    this.validateInstanceProp({ map }, 'map', DeviceMap);
    this.props.map = map;
  }

  /** Updates the device wlan. */
  updateWlan(wlan?: DeviceWlan): void {
    this.validateInstanceProp({ wlan }, 'wlan', DeviceWlan);
    this.props.wlan = wlan;
  }

  /** Updates the device battery. */
  updateBattery(battery?: DeviceBattery): void {
    this.validateInstanceProp({ battery }, 'battery', DeviceBattery);
    this.props.battery = battery;
  }

  /** Updates the device state. */
  updateState(state?: DeviceState): void {
    this.validateInstanceProp({ state }, 'state', DeviceState);
    this.props.state = state;
  }

  /** Updates the device mode. */
  updateMode(mode?: DeviceMode): void {
    this.validateInstanceProp({ mode }, 'mode', DeviceMode);
    this.props.mode = mode;
  }

  /** Updates the device error. */
  updateError(error?: DeviceError): void {
    this.validateInstanceProp({ error }, 'error', DeviceError);
    this.props.error = error;
  }

  /** Updates the device fan speed. */
  updateFanSpeed(fanSpeed?: DeviceFanSpeed): void {
    this.validateInstanceProp({ fanSpeed }, 'fanSpeed', DeviceFanSpeed);
    this.props.fanSpeed = fanSpeed;
  }

  /** Updates the device water level. */
  updateWaterLevel(waterLevel?: DeviceWaterLevel): void {
    this.validateInstanceProp({ waterLevel }, 'waterLevel', DeviceWaterLevel);
    this.props.waterLevel = waterLevel;
  }

  /** Updates whether the device has a mop attached. */
  updateHasMopAttached(value: boolean): void {
    this.validateTypeProp({ hasMopAttached: value }, 'hasMopAttached', 'boolean');
    this.props.hasMopAttached = value;
  }

  /** Updates whether the device has a waiting map. */
  updateHasWaitingMap(value: boolean): void {
    this.validateTypeProp({ hasWaitingMap: value }, 'hasWaitingMap', 'boolean');
    this.props.hasWaitingMap = value;
  }

  protected validate(props: DeviceProps): void {
    const keys: (keyof DeviceProps)[] = ['userId', 'system', 'version'];

    keys.forEach((prop) => {
      this.validateDefinedProp(props, prop);
    });

    this.validateInstanceProp(props, 'userId', ID);
    this.validateInstanceProp(props, 'system', DeviceSystem);
    this.validateInstanceProp(props, 'version', DeviceVersion);
    this.validateInstanceProp(props, 'config', DeviceSettings);
    this.validateInstanceProp(props, 'currentClean', DeviceCleanWork);
    this.validateArrayProp(props, 'orders', DeviceOrder);
    this.validateArrayProp(props, 'consumables', DeviceConsumable);
    this.validateInstanceProp(props, 'map', DeviceMap);
    this.validateInstanceProp(props, 'wlan', DeviceWlan);
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
