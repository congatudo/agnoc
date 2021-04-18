import { Entity } from "../base-classes/entity.base";
import { ArgumentNotProvidedException } from "../exceptions/argument-not-provided.exception";
import { isPresent } from "../utils/is-present.util";
import { DeviceBattery } from "../value-objects/device-battery.value-object";
import {
  DeviceConfig,
  DeviceConfigProps,
} from "../value-objects/device-config.value-object";
import { DeviceConsumable } from "../value-objects/device-consumable.value-object";
import { DeviceFanSpeed } from "../value-objects/device-fan-speed.value-object";
import { DeviceStatus } from "../value-objects/device-status.value-object";
import {
  DeviceSystem,
  DeviceSystemProps,
} from "../value-objects/device-system.value-object";
import { DeviceWaterLevel } from "../value-objects/device-water-level.value-object";
import {
  DeviceWlan,
  DeviceWlanProps,
} from "../value-objects/device-wlan.value-object";
import { ID } from "../value-objects/id.value-object";
import { DeviceMap, DeviceMapProps } from "./device-map.entity";
import { DeviceOrder } from "./device-order.entity";

export interface DeviceProps {
  id: ID;
  system: DeviceSystem;
  config?: DeviceConfig;
  status?: DeviceStatus;
  orders?: DeviceOrder[];
  consumables?: DeviceConsumable[];
  map?: DeviceMap;
  wlan?: DeviceWlan;
  battery?: DeviceBattery;
  fanSpeed?: DeviceFanSpeed;
  waterLevel?: DeviceWaterLevel;
  hasMopAttached?: boolean;
}

export class Device extends Entity<DeviceProps> {
  constructor(props: DeviceProps) {
    super(props);
    this.validate(props);
  }

  get system(): DeviceSystem {
    return this.props.system;
  }

  get config(): DeviceConfig | undefined {
    return this.props.config;
  }

  get status(): DeviceStatus | undefined {
    return this.props.status;
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

  get fanSpeed(): DeviceFanSpeed | undefined {
    return this.props.fanSpeed;
  }

  get waterLevel(): DeviceWaterLevel | undefined {
    return this.props.waterLevel;
  }

  get hasMopAttached(): boolean | undefined {
    return this.props.hasMopAttached;
  }

  updateSystem(props: Partial<DeviceSystemProps>): void {
    this.props.system = new DeviceSystem({
      ...this.props.system.getRawProps(),
      ...props,
    } as DeviceSystemProps);
  }

  updateConfig(props: Partial<DeviceConfigProps>): void {
    this.props.config = new DeviceConfig({
      ...this.props.config?.getRawProps(),
      ...props,
    } as DeviceConfigProps);
  }

  updateStatus(status: DeviceStatus): void {
    this.props.status = status;
  }

  updateOrders(orders: DeviceOrder[]): void {
    this.props.orders = orders;
  }

  updateConsumables(consumables: DeviceConsumable[]): void {
    this.props.consumables = consumables;
  }

  updateMap(map: Partial<DeviceMapProps>): void {
    this.props.map = new DeviceMap({
      ...this.props.map?.getPropsCopy(),
      ...map,
    } as DeviceMapProps);
  }

  updateWlan(props: Partial<DeviceWlanProps>): void {
    this.props.wlan = new DeviceWlan({
      ...this.props.wlan?.getRawProps(),
      ...props,
    } as DeviceWlanProps);
  }

  updateBattery(battery: DeviceBattery): void {
    this.props.battery = battery;
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

  protected validate(props: DeviceProps): void {
    if (![props.system].every(isPresent)) {
      throw new ArgumentNotProvidedException(
        "Missing property in device constructor"
      );
    }
  }
}
