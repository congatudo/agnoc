import { Entity, isPresent, ArgumentNotProvidedException } from '@agnoc/toolkit';
import type { DeviceMap } from './device-map.entity';
import type { DeviceOrder } from './device-order.entity';
import type { DeviceBattery } from '../primitives/device-battery.value-object';
import type { DeviceError } from '../primitives/device-error.value-object';
import type { DeviceFanSpeed } from '../primitives/device-fan-speed.value-object';
import type { DeviceMode } from '../primitives/device-mode.value-object';
import type { DeviceState } from '../primitives/device-state.value-object';
import type { DeviceWaterLevel } from '../primitives/device-water-level.value-object';
import type { DeviceCleanWork } from '../value-objects/device-clean-work.value-object';
import type { DeviceConsumable } from '../value-objects/device-consumable.value-object';
import type { DeviceSettings } from '../value-objects/device-settings.value-object';
import type { DeviceSystem } from '../value-objects/device-system.value-object';
import type { DeviceVersion } from '../value-objects/device-version.value-object';
import type { DeviceWlan } from '../value-objects/device-wlan.value-object';
import type { ID } from '@agnoc/toolkit';

export interface DeviceProps {
  id: ID;
  system: DeviceSystem;
  version: DeviceVersion;
  config?: DeviceSettings;
  currentClean?: DeviceCleanWork;
  orders?: DeviceOrder[];
  consumables?: DeviceConsumable[];
  map?: DeviceMap;
  wlan?: DeviceWlan;
  battery?: DeviceBattery;
  state?: DeviceState;
  mode?: DeviceMode;
  error?: DeviceError;
  fanSpeed?: DeviceFanSpeed;
  waterLevel?: DeviceWaterLevel;
  hasMopAttached?: boolean;
  hasWaitingMap?: boolean;
}

export class Device extends Entity<DeviceProps> {
  constructor(props: DeviceProps) {
    super({
      hasWaitingMap: false,
      ...props,
    });
    this.validate(props);
  }

  get system(): DeviceSystem {
    return this.props.system;
  }

  get version(): DeviceVersion {
    return this.props.version;
  }

  get config(): DeviceSettings | undefined {
    return this.props.config;
  }

  get currentClean(): DeviceCleanWork | undefined {
    return this.props.currentClean;
  }

  get orders(): DeviceOrder[] | undefined {
    return this.props.orders;
  }

  get consumables(): DeviceConsumable[] | undefined {
    return this.props.consumables;
  }

  get map(): DeviceMap | undefined {
    return this.props.map;
  }

  get wlan(): DeviceWlan | undefined {
    return this.props.wlan;
  }

  get battery(): DeviceBattery | undefined {
    return this.props.battery;
  }

  get state(): DeviceState | undefined {
    return this.props.state;
  }

  get mode(): DeviceMode | undefined {
    return this.props.mode;
  }

  get error(): DeviceError | undefined {
    return this.props.error;
  }

  get fanSpeed(): DeviceFanSpeed | undefined {
    return this.props.fanSpeed;
  }

  get waterLevel(): DeviceWaterLevel | undefined {
    return this.props.waterLevel;
  }

  get hasMopAttached(): boolean | undefined {
    return this.props.hasMopAttached;
  }

  get hasWaitingMap(): boolean | undefined {
    return this.props.hasWaitingMap;
  }

  updateSystem(system: DeviceSystem): void {
    this.props.system = system;
  }

  updateVersion(version: DeviceVersion): void {
    this.props.version = version;
  }

  updateConfig(config?: DeviceSettings): void {
    this.props.config = config;
  }

  updateCurrentClean(currentClean: DeviceCleanWork): void {
    this.props.currentClean = currentClean;
  }

  updateOrders(orders: DeviceOrder[]): void {
    this.props.orders = orders;
  }

  updateConsumables(consumables: DeviceConsumable[]): void {
    this.props.consumables = consumables;
  }

  updateMap(map: DeviceMap): void {
    this.props.map = map;
  }

  updateWlan(wlan: DeviceWlan): void {
    this.props.wlan = wlan;
  }

  updateBattery(battery: DeviceBattery): void {
    this.props.battery = battery;
  }

  updateState(state: DeviceState): void {
    this.props.state = state;
  }

  updateMode(mode: DeviceMode): void {
    this.props.mode = mode;
  }

  updateError(error: DeviceError): void {
    this.props.error = error;
  }

  updateFanSpeed(fanSpeed: DeviceFanSpeed): void {
    this.props.fanSpeed = fanSpeed;
  }

  updateWaterLevel(waterLevel: DeviceWaterLevel): void {
    this.props.waterLevel = waterLevel;
  }

  updateHasMopAttached(value: boolean): void {
    this.props.hasMopAttached = value;
  }

  updateHasWaitingMap(value: boolean): void {
    this.props.hasWaitingMap = value;
  }

  protected validate(props: DeviceProps): void {
    if (![props.system, props.version].every(isPresent)) {
      throw new ArgumentNotProvidedException('Missing property in device constructor');
    }
  }
}
