import { Entity } from "../base-classes/entity.base";
import { ArgumentNotProvidedException } from "../exceptions/argument-not-provided.exception";
import { isPresent } from "../utils/is-present.util";
import { DeviceConsumable } from "../value-objects/device-consumable.value-object";
import {
  DeviceStatus,
  DeviceStatusProps,
} from "../value-objects/device-status.value-object";
import {
  DeviceSystem,
  DeviceSystemProps,
} from "../value-objects/device-system.value-object";
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
  status?: DeviceStatus;
  orders?: DeviceOrder[];
  consumables?: DeviceConsumable[];
  map?: DeviceMap;
  wlan?: DeviceWlan;
}

export class Device extends Entity<DeviceProps> {
  constructor(props: DeviceProps) {
    super(props);
    this.validate(props);
  }

  get system(): DeviceSystem {
    return this.props.system;
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

  updateSystem(props: Partial<DeviceSystemProps>): void {
    this.props.system = new DeviceSystem({
      ...this.props.system.getRawProps(),
      ...props,
    } as DeviceSystemProps);
  }

  updateStatus(props: Partial<DeviceStatusProps>): void {
    this.props.status = new DeviceStatus({
      ...this.props.status?.getRawProps(),
      ...props,
    } as DeviceStatusProps);
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

  toString(): string {
    return [
      `system: [${this.system.toString()}]`,
      `status: [${this.status?.toString() || "unknown"}]`,
      `orders: [${
        this.orders?.map((item) => item.toString()).join(", ") || "unknown"
      }]`,
      `consumables: [${
        this.consumables?.map((item) => item.toString()).join(", ") || "unknown"
      }]`,
    ].join(" ");
  }

  protected validate(props: DeviceProps): void {
    if (![props.system].map(isPresent)) {
      throw new ArgumentNotProvidedException(
        "Missing property in device constructor"
      );
    }
  }
}
