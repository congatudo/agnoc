import { Entity, isPresent, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
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
  /** The device system. */
  system: DeviceSystem;
  /** The device version. */
  version: DeviceVersion;
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
  /** Whenether the device has a mop attached. */
  hasMopAttached?: boolean;
  /** Whenether the device has a waiting map. */
  hasWaitingMap?: boolean;
}

/** Describes a device. */
export class Device extends Entity<DeviceProps> {
  /** Returns the device system. */
  get system(): DeviceSystem {
    return this.props.system;
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

  /** Returns whenether the device has a mop attached. */
  get hasMopAttached(): boolean {
    return Boolean(this.props.hasMopAttached);
  }

  /** Returns whenether the device has a waiting map. */
  get hasWaitingMap(): boolean {
    return Boolean(this.props.hasWaitingMap);
  }

  /** Updates the device system. */
  updateSystem(system: DeviceSystem): void {
    this.props.system = system;
  }

  /** Updates the device version. */
  updateVersion(version: DeviceVersion): void {
    this.props.version = version;
  }

  /** Updates the device settings. */
  updateConfig(config?: DeviceSettings): void {
    this.props.config = config;
  }

  /** Updates the device current clean. */
  updateCurrentClean(currentClean: DeviceCleanWork): void {
    this.props.currentClean = currentClean;
  }

  /** Updates the device orders. */
  updateOrders(orders: DeviceOrder[]): void {
    this.props.orders = orders;
  }

  /** Updates the device consumables. */
  updateConsumables(consumables: DeviceConsumable[]): void {
    this.props.consumables = consumables;
  }

  /** Updates the device map. */
  updateMap(map: DeviceMap): void {
    this.props.map = map;
  }

  /** Updates the device wlan. */
  updateWlan(wlan: DeviceWlan): void {
    this.props.wlan = wlan;
  }

  /** Updates the device battery. */
  updateBattery(battery: DeviceBattery): void {
    this.props.battery = battery;
  }

  /** Updates the device state. */
  updateState(state: DeviceState): void {
    this.props.state = state;
  }

  /** Updates the device mode. */
  updateMode(mode: DeviceMode): void {
    this.props.mode = mode;
  }

  /** Updates the device error. */
  updateError(error: DeviceError): void {
    this.props.error = error;
  }

  /** Updates the device fan speed. */
  updateFanSpeed(fanSpeed: DeviceFanSpeed): void {
    this.props.fanSpeed = fanSpeed;
  }

  /** Updates the device water level. */
  updateWaterLevel(waterLevel: DeviceWaterLevel): void {
    this.props.waterLevel = waterLevel;
  }

  /** Updates whenether the device has a mop attached. */
  updateHasMopAttached(value: boolean): void {
    this.props.hasMopAttached = value;
  }

  /** Updates whenether the device has a waiting map. */
  updateHasWaitingMap(value: boolean): void {
    this.props.hasWaitingMap = value;
  }

  protected validate(props: DeviceProps): void {
    const keys: (keyof DeviceProps)[] = ['system', 'version'];

    keys.forEach((prop) => {
      if (!isPresent(props[prop])) {
        throw new ArgumentNotProvidedException(`Property '${prop}' for ${this.constructor.name} not provided`);
      }
    });

    if (!(props.system instanceof DeviceSystem)) {
      throw new ArgumentInvalidException(
        `Value '${props.system as string}' for property 'system' for ${this.constructor.name} is not a ${
          DeviceSystem.name
        }`,
      );
    }

    if (!(props.version instanceof DeviceVersion)) {
      throw new ArgumentInvalidException(
        `Value '${props.version as string}' for property 'version' for ${this.constructor.name} is not a ${
          DeviceVersion.name
        }`,
      );
    }

    if (isPresent(props.config) && !(props.config instanceof DeviceSettings)) {
      throw new ArgumentInvalidException(
        `Value '${props.config as string}' for property 'config' for ${this.constructor.name} is not a ${
          DeviceSettings.name
        }`,
      );
    }

    if (isPresent(props.currentClean) && !(props.currentClean instanceof DeviceCleanWork)) {
      throw new ArgumentInvalidException(
        `Value '${props.currentClean as string}' for property 'currentClean' for ${this.constructor.name} is not a ${
          DeviceCleanWork.name
        }`,
      );
    }

    if (isPresent(props.orders)) {
      if (!Array.isArray(props.orders)) {
        throw new ArgumentInvalidException(
          `Value '${props.orders as string}' for property 'orders' for ${this.constructor.name} is not an array of ${
            DeviceOrder.name
          }`,
        );
      }

      if (!props.orders.every((item) => item instanceof DeviceOrder)) {
        throw new ArgumentInvalidException(
          `Value '${props.orders.join(', ')}' for property 'orders' for ${this.constructor.name} is not an array of ${
            DeviceOrder.name
          }`,
        );
      }
    }

    if (isPresent(props.consumables)) {
      if (!Array.isArray(props.consumables)) {
        throw new ArgumentInvalidException(
          `Value '${props.consumables as string}' for property 'consumables' for ${
            this.constructor.name
          } is not an array of ${DeviceConsumable.name}`,
        );
      }

      if (!props.consumables.every((item) => item instanceof DeviceConsumable)) {
        throw new ArgumentInvalidException(
          `Value '${props.consumables.join(', ')}' for property 'consumables' for ${
            this.constructor.name
          } is not an array of ${DeviceConsumable.name}`,
        );
      }
    }

    if (isPresent(props.map) && !(props.map instanceof DeviceMap)) {
      throw new ArgumentInvalidException(
        `Value '${props.map as string}' for property 'map' for ${this.constructor.name} is not a ${DeviceMap.name}`,
      );
    }

    if (isPresent(props.wlan) && !(props.wlan instanceof DeviceWlan)) {
      throw new ArgumentInvalidException(
        `Value '${props.wlan as string}' for property 'wlan' for ${this.constructor.name} is not a ${DeviceWlan.name}`,
      );
    }

    if (isPresent(props.battery) && !(props.battery instanceof DeviceBattery)) {
      throw new ArgumentInvalidException(
        `Value '${props.battery as string}' for property 'battery' for ${this.constructor.name} is not a ${
          DeviceBattery.name
        }`,
      );
    }

    if (isPresent(props.state) && !(props.state instanceof DeviceState)) {
      throw new ArgumentInvalidException(
        `Value '${props.state as string}' for property 'state' for ${this.constructor.name} is not a ${
          DeviceState.name
        }`,
      );
    }

    if (isPresent(props.mode) && !(props.mode instanceof DeviceMode)) {
      throw new ArgumentInvalidException(
        `Value '${props.mode as string}' for property 'mode' for ${this.constructor.name} is not a ${DeviceMode.name}`,
      );
    }

    if (isPresent(props.error) && !(props.error instanceof DeviceError)) {
      throw new ArgumentInvalidException(
        `Value '${props.error as string}' for property 'error' for ${this.constructor.name} is not a ${
          DeviceError.name
        }`,
      );
    }

    if (isPresent(props.fanSpeed) && !(props.fanSpeed instanceof DeviceFanSpeed)) {
      throw new ArgumentInvalidException(
        `Value '${props.fanSpeed as string}' for property 'fanSpeed' for ${this.constructor.name} is not a ${
          DeviceFanSpeed.name
        }`,
      );
    }

    if (isPresent(props.waterLevel) && !(props.waterLevel instanceof DeviceWaterLevel)) {
      throw new ArgumentInvalidException(
        `Value '${props.waterLevel as string}' for property 'waterLevel' for ${this.constructor.name} is not a ${
          DeviceWaterLevel.name
        }`,
      );
    }

    if (isPresent(props.hasMopAttached) && typeof props.hasMopAttached !== 'boolean') {
      throw new ArgumentInvalidException(
        `Value '${props.hasMopAttached as string}' for property 'hasMopAttached' for ${
          this.constructor.name
        } is not a boolean`,
      );
    }

    if (isPresent(props.hasWaitingMap) && typeof props.hasWaitingMap !== 'boolean') {
      throw new ArgumentInvalidException(
        `Value '${props.hasWaitingMap as string}' for property 'hasWaitingMap' for ${
          this.constructor.name
        } is not a boolean`,
      );
    }
  }
}
