import { IDEVICE_ORDERLIST_SETTING_REQ } from "../../schemas/schema";
import { Entity } from "../base-classes/entity.base";
import { ArgumentInvalidException } from "../exceptions/argument-invalid.exception";
import { ArgumentNotProvidedException } from "../exceptions/argument-not-provided.exception";
import { isPresent } from "../utils/is-present.util";
import {
  FanSpeed,
  FAN_SPEED,
} from "../value-objects/device-status.value-object";
import { DeviceTime } from "../value-objects/device-time.value-object";
import { ID } from "../value-objects/id.value-object";

export enum WeekDay {
  "sunday" = 1 << 0,
  "monday" = 1 << 1,
  "tuesday" = 1 << 2,
  "wednesday" = 1 << 3,
  "thursday" = 1 << 4,
  "friday" = 1 << 5,
  "saturday" = 1 << 6,
}

export enum CLEAN_MODE {
  "auto" = 1,
  "border" = 3,
  "mop" = 4,
}

export type CleanMode = keyof typeof CLEAN_MODE;

export interface DeviceOrderProps {
  id: ID;
  mapId: ID;
  planId: ID;
  isEnabled: boolean;
  isRepeatable: boolean;
  isDeepClean: boolean;
  weekDay: WeekDay;
  time: DeviceTime;
  cleanMode: CleanMode;
  fanSpeed: FanSpeed;
  waterLevel: number;
}

export class DeviceOrder extends Entity<DeviceOrderProps> {
  constructor(props: DeviceOrderProps) {
    super(props);
    this.validate(props);
  }

  get id(): ID {
    return this.props.id;
  }

  get mapId(): ID {
    return this.props.mapId;
  }

  get planId(): ID {
    return this.props.planId;
  }

  get isEnabled(): boolean {
    return this.props.isEnabled;
  }

  get isRepeatable(): boolean {
    return this.props.isRepeatable;
  }

  get isDeepClean(): boolean {
    return this.props.isDeepClean;
  }

  get weekDay(): WeekDay {
    return this.props.weekDay;
  }

  get time(): DeviceTime {
    return this.props.time;
  }

  get cleanMode(): CleanMode {
    return this.props.cleanMode;
  }

  get fanSpeed(): FanSpeed {
    return this.props.fanSpeed;
  }

  get waterLevel(): number {
    return this.props.waterLevel;
  }

  static fromOrderList(orderList: IDEVICE_ORDERLIST_SETTING_REQ): DeviceOrder {
    if (!orderList.cleanInfo) {
      throw new ArgumentNotProvidedException(
        "Unable to read clean info from order list"
      );
    }

    const time = DeviceTime.fromMinutes(orderList.dayTime);
    const props: DeviceOrderProps = {
      id: new ID(orderList.orderId),
      mapId: new ID(orderList.cleanInfo.mapHeadId),
      planId: new ID(orderList.cleanInfo.planId),
      isEnabled: orderList.enable,
      isRepeatable: orderList.enable,
      isDeepClean: orderList.cleanInfo.twiceClean,
      weekDay: orderList.weekDay,
      time,
      cleanMode: CLEAN_MODE[orderList.cleanInfo.cleanMode] as CleanMode,
      fanSpeed: FAN_SPEED[orderList.cleanInfo.windPower] as FanSpeed,
      waterLevel: orderList.cleanInfo.waterLevel,
    };

    return new DeviceOrder(props);
  }

  toOrderList(): IDEVICE_ORDERLIST_SETTING_REQ {
    const orderList: IDEVICE_ORDERLIST_SETTING_REQ = {
      orderId: this.id.value,
      enable: this.isEnabled,
      repeat: this.isRepeatable,
      weekDay: this.weekDay,
      dayTime: this.time.toMinutes(),
      cleanInfo: {
        mapHeadId: this.mapId.value,
        planId: this.planId.value,
        cleanMode: CLEAN_MODE[this.cleanMode],
        windPower: FAN_SPEED[this.fanSpeed],
        waterLevel: this.waterLevel,
        twiceClean: this.isDeepClean,
      },
    };

    return orderList;
  }

  private validate(props: DeviceOrderProps) {
    if (
      ![
        props.id,
        props.mapId,
        props.planId,
        props.isEnabled,
        props.isRepeatable,
        props.isDeepClean,
        props.weekDay,
        props.time,
        props.cleanMode,
        props.fanSpeed,
        props.waterLevel,
      ].map(isPresent)
    ) {
      throw new ArgumentNotProvidedException(
        "Missing property in device order constructor"
      );
    }

    if (!(props.id instanceof ID)) {
      throw new ArgumentInvalidException(
        "Invalid id in device order constructor"
      );
    }

    if (!(props.mapId instanceof ID)) {
      throw new ArgumentInvalidException(
        "Invalid mapId in device order constructor"
      );
    }

    if (!(props.planId instanceof ID)) {
      throw new ArgumentInvalidException(
        "Invalid planId in device order constructor"
      );
    }

    if (!(props.time instanceof DeviceTime)) {
      throw new ArgumentInvalidException(
        "Invalid time in device order constructor"
      );
    }

    if (!Object.keys(CLEAN_MODE).includes(props.cleanMode)) {
      throw new ArgumentInvalidException(
        "Invalid cleanMode in device order constructor"
      );
    }

    if (!Object.keys(FAN_SPEED).includes(props.fanSpeed)) {
      throw new ArgumentInvalidException(
        "Invalid cleanMode in device order constructor"
      );
    }
  }
}
