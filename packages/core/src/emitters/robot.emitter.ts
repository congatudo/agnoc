/* eslint-disable @typescript-eslint/unbound-method */
import { bind } from "../decorators/bind.decorator";
import { Connection } from "./connection.emitter";
import { Multiplexer } from "./multiplexer.emitter";
import {
  Message,
  MessageHandler,
  MessageHandlers,
} from "../value-objects/message.value-object";
import { Packet } from "../value-objects/packet.value-object";
import { Device } from "../entities/device.entity";
import { User } from "../entities/user.entity";
import { debug } from "../utils/debug.util";
import { DEVICE_CAPABILITY } from "../value-objects/device-system.value-object";
import { TypedEmitter } from "tiny-typed-emitter";
import { Debugger } from "debug";
import { DeviceOrder } from "../entities/device-order.entity";
import {
  ConsumableType,
  CONSUMABLE_TYPE,
  DeviceConsumable,
} from "../value-objects/device-consumable.value-object";
import { DeviceMap } from "../entities/device-map.entity";
import { Coordinate } from "../value-objects/coordinate.value-object";
import { Position } from "../value-objects/position.value-object";
import { ID } from "../value-objects/id.value-object";
import { DomainException } from "../exceptions/domain.exception";
import { Room } from "../entities/room.entity";
import { isPresent } from "../utils/is-present.util";
import { DeviceWlan } from "../value-objects/device-wlan.value-object";
import { Zone } from "../entities/zone.entity";
import { waitFor } from "../utils/wait-for.util";
import { ArgumentInvalidException } from "../exceptions/argument-invalid.exception";
import { DeviceConfig } from "../value-objects/device-config.value-object";
import { DeviceQuietHours } from "../value-objects/device-quiet-hours.value-object";
import { DeviceTime } from "../value-objects/device-time.value-object";
import { OPDecoderLiteral, OPDecoders } from "../constants/opcodes.constant";
import { DeviceWaterLevel } from "../value-objects/device-water-level.value-object";
import { DeviceWaterLevelMapper } from "../mappers/device-water-level.mapper";
import { DeviceFanSpeedMapper } from "../mappers/device-fan-speed.mapper";
import { DeviceFanSpeed } from "../value-objects/device-fan-speed.value-object";
import { DeviceBatteryMapper } from "../mappers/device-battery.mapper";
import { DeviceStateMapper } from "../mappers/device-state.mapper";
import { DeviceModeMapper } from "../mappers/device-mode.mapper";
import { DeviceMode } from "../value-objects/device-mode.value-object";
import { DeviceErrorMapper } from "../mappers/device-error.mapper";
import { DeviceVersion } from "../value-objects/device-version.value-object";
import { DeviceCurrentClean } from "../value-objects/device-current-clean.value-object";
import { BufferWriter } from "../streams/buffer-writer.stream";
import { writeByte, writeFloat } from "../utils/stream.util";
import { DeviceVoice } from "../value-objects/device-voice.value-object";
import { DeviceVoiceMapper } from "../mappers/device-voice.mapper";
import { Pixel } from "../value-objects/pixel.value-object";

export interface RobotProps {
  device: Device;
  user: User;
  multiplexer: Multiplexer;
}

interface DeviceTimestamp {
  timestamp: number;
  offset: number;
}

interface RobotEvents {
  updateDevice: () => void;
  updateMap: () => void;
  updateRobotPosition: () => void;
  updateChargerPosition: () => void;
}

export enum MANUAL_MODE {
  "forward" = 1,
  "left" = 2,
  "right" = 3,
  "backward" = 4,
  "stop" = 5,
  "init" = 10,
}

export type ManualMode = typeof MANUAL_MODE[keyof typeof MANUAL_MODE];

const MODE_CHANGE_TIMEOUT = 5000;
const RECV_TIMEOUT = 5000;

const CONSUMABLE_TYPE_RESET = {
  [CONSUMABLE_TYPE.MAIN_BRUSH]: 1,
  [CONSUMABLE_TYPE.SIDE_BRUSH]: 2,
  [CONSUMABLE_TYPE.FILTER]: 3,
  [CONSUMABLE_TYPE.DISHCLOTH]: 4,
};

const CTRL_VALUE = {
  STOP: 0,
  START: 1,
  PAUSE: 2,
};

export class Robot extends TypedEmitter<RobotEvents> {
  public readonly device: Device;
  public readonly user: User;
  private readonly multiplexer: Multiplexer;
  private debug: Debugger;
  private handlers: MessageHandlers = {
    CLIENT_HEARTBEAT_REQ: this.handleClientHeartbeat,
    DEVICE_MAPID_GET_GLOBAL_INFO_RSP: this.handleMapUpdate,
    DEVICE_MAPID_PUSH_CHARGE_POSITION_INFO: this.handleUpdateChargePosition,
    DEVICE_MAPID_PUSH_MAP_INFO: this.handleMapUpdate,
    DEVICE_MAPID_PUSH_POSITION_INFO: this.handleUpdateRobotPosition,
    DEVICE_MAPID_WORK_STATUS_PUSH_REQ: this.handleDeviceStatus,
    DEVICE_VERSION_INFO_UPDATE_REQ: this.handleDeviceVersionInfoUpdate,
    PUSH_DEVICE_AGENT_SETTING_REQ: this.handleDeviceAgentSetting,
    PUSH_DEVICE_BATTERY_INFO_REQ: this.handleDeviceBatteryInfo,
    PUSH_DEVICE_PACKAGE_UPGRADE_INFO_REQ: this.handleDevicePackageUpgrade,
    DEVICE_MAPID_PUSH_HAS_WAITING_BE_SAVED: this.handleWaitingMap,
    DEVICE_WORKSTATUS_REPORT_REQ: this.handleWorkstatusReport,
    DEVICE_EVENT_REPORT_CLEANTASK: this.handleReportCleantask,
    DEVICE_EVENT_REPORT_CLEANMAP: this.handleReportCleanmap,
    DEVICE_CLEANMAP_BINDATA_REPORT_REQ: this.handleBinDataReport,
    DEVICE_EVENT_REPORT_REQ: this.handleEventReport,
  };

  constructor({ device, user, multiplexer }: RobotProps) {
    super();
    this.device = device;
    this.user = user;
    this.multiplexer = multiplexer;
    this.debug = debug(__filename).extend(this.device.id.toString());
    this.debug("new robot");
  }

  get isConnected(): boolean {
    return this.multiplexer.hasConnections;
  }

  async start(): Promise<void> {
    if (this.device.mode?.value === DeviceMode.VALUE.ZONE) {
      await this.sendRecv("DEVICE_AREA_CLEAN_REQ", "DEVICE_AREA_CLEAN_RSP", {
        ctrlValue: CTRL_VALUE.START,
      });
    } else if (this.device.mode?.value === DeviceMode.VALUE.MOP) {
      await this.sendRecv(
        "DEVICE_MOP_FLOOR_CLEAN_REQ",
        "DEVICE_MOP_FLOOR_CLEAN_RSP",
        {
          ctrlValue: CTRL_VALUE.START,
        }
      );
    } else if (
      this.device.mode?.value === DeviceMode.VALUE.SPOT &&
      this.device.map?.currentSpot
    ) {
      await this.sendRecv(
        "DEVICE_MAPID_SET_NAVIGATION_REQ",
        "DEVICE_MAPID_SET_NAVIGATION_RSP",
        {
          mapHeadId: this.device.map.id.value,
          poseX: this.device.map.currentSpot.x,
          poseY: this.device.map.currentSpot.y,
          posePhi: this.device.map.currentSpot.phi,
          ctrlValue: CTRL_VALUE.START,
        }
      );
    } else {
      await this.sendRecv("DEVICE_AUTO_CLEAN_REQ", "DEVICE_AUTO_CLEAN_RSP", {
        ctrlValue: CTRL_VALUE.START,
        cleanType: 2,
      });
    }
  }

  async pause(): Promise<void> {
    if (this.device.mode?.value === DeviceMode.VALUE.ZONE) {
      await this.sendRecv("DEVICE_AREA_CLEAN_REQ", "DEVICE_AREA_CLEAN_RSP", {
        ctrlValue: CTRL_VALUE.PAUSE,
      });
    } else if (this.device.mode?.value === DeviceMode.VALUE.MOP) {
      await this.sendRecv(
        "DEVICE_MOP_FLOOR_CLEAN_REQ",
        "DEVICE_MOP_FLOOR_CLEAN_RSP",
        {
          ctrlValue: CTRL_VALUE.PAUSE,
        }
      );
    } else if (
      this.device.mode?.value === DeviceMode.VALUE.SPOT &&
      this.device.map?.currentSpot
    ) {
      await this.sendRecv(
        "DEVICE_MAPID_SET_NAVIGATION_REQ",
        "DEVICE_MAPID_SET_NAVIGATION_RSP",
        {
          mapHeadId: this.device.map.id.value,
          poseX: this.device.map.currentSpot.x,
          poseY: this.device.map.currentSpot.y,
          posePhi: this.device.map.currentSpot.phi,
          ctrlValue: CTRL_VALUE.PAUSE,
        }
      );
    } else {
      await this.sendRecv("DEVICE_AUTO_CLEAN_REQ", "DEVICE_AUTO_CLEAN_RSP", {
        ctrlValue: CTRL_VALUE.PAUSE,
        cleanType: 2,
      });
    }
  }

  async stop(): Promise<void> {
    await this.sendRecv("DEVICE_AUTO_CLEAN_REQ", "DEVICE_AUTO_CLEAN_RSP", {
      ctrlValue: CTRL_VALUE.STOP,
      cleanType: 2,
    });

    if (this.device.map?.rooms) {
      const { id, restrictedZones } = this.device.map;

      await this.sendRecv(
        "DEVICE_MAPID_SET_PLAN_PARAMS_REQ",
        "DEVICE_MAPID_SET_PLAN_PARAMS_RSP",
        {
          mapHeadId: id.value,
          // FIXME: this will change user map name.
          mapName: "Default",
          planId: 2,
          // FIXME: this will change user plan name.
          planName: "Default",
          roomList: this.device.map.rooms.map((room) => ({
            roomId: room.id.value,
            roomName: room.name,
            enable: true,
          })),
          areaInfo: {
            mapHeadId: id.value,
            planId: 2,
            cleanAreaLength: restrictedZones.length,
            cleanAreaList: restrictedZones.map((zone) => ({
              cleanAreaId: zone.id.value,
              type: 0,
              coordinateLength: zone.coordinates.length,
              coordinateList: zone.coordinates.map(({ x, y }) => ({ x, y })),
            })),
          },
        }
      );
    }
  }

  async home(): Promise<void> {
    await this.sendRecv("DEVICE_CHARGE_REQ", "DEVICE_CHARGE_RSP", {
      enable: 1,
    });
  }

  async locate(): Promise<void> {
    await this.sendRecv(
      "DEVICE_SEEK_LOCATION_REQ",
      "DEVICE_SEEK_LOCATION_RSP",
      {}
    );
  }

  async setMode(mode: DeviceMode): Promise<void> {
    if (mode.value === DeviceMode.VALUE.NONE) {
      await this.sendRecv("DEVICE_AUTO_CLEAN_REQ", "DEVICE_AUTO_CLEAN_RSP", {
        ctrlValue: CTRL_VALUE.STOP,
        cleanType: 2,
      });
    } else if (mode.value === DeviceMode.VALUE.SPOT) {
      let mask = 0x78ff | 0x200;

      if (!this.device.system.supports(DEVICE_CAPABILITY.MAP_PLANS)) {
        mask = 0xff | 0x200;
      }

      await this.sendRecv(
        "DEVICE_MAPID_GET_GLOBAL_INFO_REQ",
        "DEVICE_MAPID_GET_GLOBAL_INFO_RSP",
        { mask }
      );
    } else if (mode.value === DeviceMode.VALUE.ZONE) {
      await this.sendRecv("DEVICE_AREA_CLEAN_REQ", "DEVICE_AREA_CLEAN_RSP", {
        ctrlValue: CTRL_VALUE.STOP,
      });

      let mask = 0x78ff | 0x100;

      if (!this.device.system.supports(DEVICE_CAPABILITY.MAP_PLANS)) {
        mask = 0xff | 0x100;
      }

      await this.sendRecv(
        "DEVICE_MAPID_GET_GLOBAL_INFO_REQ",
        "DEVICE_MAPID_GET_GLOBAL_INFO_RSP",
        { mask }
      );
    } else if (mode.value === DeviceMode.VALUE.MOP) {
      await this.sendRecv(
        "DEVICE_MAPID_INTO_MODEIDLE_INFO_REQ",
        "DEVICE_MAPID_INTO_MODEIDLE_INFO_RSP",
        {
          mode: 7,
        }
      );
    } else {
      throw new ArgumentInvalidException("Unknown device mode");
    }
  }

  async setFanSpeed(fanSpeed: DeviceFanSpeed): Promise<void> {
    await this.sendRecv(
      "DEVICE_SET_CLEAN_PREFERENCE_REQ",
      "DEVICE_SET_CLEAN_PREFERENCE_RSP",
      { mode: DeviceFanSpeedMapper.toRobot(fanSpeed) }
    );
  }

  async setWaterLevel(waterLevel: DeviceWaterLevel): Promise<void> {
    await this.sendRecv(
      "DEVICE_SET_CLEAN_PREFERENCE_REQ",
      "DEVICE_SET_CLEAN_PREFERENCE_RSP",
      { mode: DeviceWaterLevelMapper.toRobot(waterLevel) }
    );
  }

  async getTime(): Promise<DeviceTimestamp> {
    const packet = await this.sendRecv(
      "DEVICE_GETTIME_REQ",
      "DEVICE_GETTIME_RSP",
      {}
    );
    const object = packet.payload.object;

    return {
      timestamp: object.body.deviceTime * 1000,
      offset: object.body.deviceTimezone,
    };
  }

  async getConsumables(): Promise<DeviceConsumable[]> {
    if (!this.device.system.supports(DEVICE_CAPABILITY.CONSUMABLES)) {
      return [];
    }

    const packet = await this.sendRecv(
      "DEVICE_MAPID_GET_CONSUMABLES_PARAM_REQ",
      "DEVICE_MAPID_GET_CONSUMABLES_PARAM_RSP",
      {}
    );
    const object = packet.payload.object;
    const consumables = [
      new DeviceConsumable({
        type: CONSUMABLE_TYPE.MAIN_BRUSH,
        used: object.mainBrushTime,
      }),
      new DeviceConsumable({
        type: CONSUMABLE_TYPE.SIDE_BRUSH,
        used: object.sideBrushTime,
      }),
      new DeviceConsumable({
        type: CONSUMABLE_TYPE.FILTER,
        used: object.filterTime,
      }),
      new DeviceConsumable({
        type: CONSUMABLE_TYPE.DISHCLOTH,
        used: object.dishclothTime,
      }),
    ];

    this.device.updateConsumables(consumables);

    return consumables;
  }

  async resetConsumable(consumable: ConsumableType): Promise<void> {
    if (!(consumable in CONSUMABLE_TYPE_RESET)) {
      throw new ArgumentInvalidException("Invalid consumable");
    }

    const itemId = CONSUMABLE_TYPE_RESET[consumable];

    await this.sendRecv(
      "DEVICE_MAPID_SET_CONSUMABLES_PARAM_REQ",
      "DEVICE_MAPID_SET_CONSUMABLES_PARAM_RSP",
      { itemId }
    );
  }

  async updateMap(): Promise<void> {
    let mask = 0x78ff;

    if (!this.device.system.supports(DEVICE_CAPABILITY.MAP_PLANS)) {
      mask = 0xff;
    }

    await this.sendRecv(
      "DEVICE_MAPID_GET_GLOBAL_INFO_REQ",
      "DEVICE_MAPID_GET_GLOBAL_INFO_RSP",
      { mask }
    );
  }

  async getWlan(): Promise<DeviceWlan> {
    const packet = await this.sendRecv(
      "DEVICE_WLAN_INFO_GETTING_REQ",
      "DEVICE_WLAN_INFO_GETTING_RSP",
      {}
    );
    const object = packet.payload.object;

    this.device.updateWlan(new DeviceWlan(object.body));
    this.emit("updateDevice");

    return this.device.wlan as DeviceWlan;
  }

  async enterManualMode(): Promise<void> {
    await this.sendRecv("DEVICE_AUTO_CLEAN_REQ", "DEVICE_AUTO_CLEAN_RSP", {
      ctrlValue: CTRL_VALUE.STOP,
      cleanType: 2,
    });
    await this.sendRecv("DEVICE_MANUAL_CTRL_REQ", "DEVICE_MANUAL_CTRL_RSP", {
      command: MANUAL_MODE.init,
    });
  }

  async leaveManualMode(): Promise<void> {
    await this.sendRecv("DEVICE_AUTO_CLEAN_REQ", "DEVICE_AUTO_CLEAN_RSP", {
      ctrlValue: CTRL_VALUE.PAUSE,
      cleanType: 2,
    });
  }

  async setManualMode(command: ManualMode): Promise<void> {
    await this.sendRecv("DEVICE_MANUAL_CTRL_REQ", "DEVICE_MANUAL_CTRL_RSP", {
      command,
    });
  }

  async getOrders(): Promise<DeviceOrder[]> {
    const packet = await this.sendRecv(
      "DEVICE_ORDERLIST_GETTING_REQ",
      "DEVICE_ORDERLIST_GETTING_RSP",
      {}
    );
    const object = packet.payload.object;
    const orders = object.orderList?.map(DeviceOrder.fromOrderList) || [];

    this.device.updateOrders(orders);

    return orders;
  }

  async setOrder(order: DeviceOrder): Promise<void> {
    const orderList = order.toOrderList();

    await this.sendRecv(
      "DEVICE_ORDERLIST_SETTING_REQ",
      "DEVICE_ORDERLIST_SETTING_RSP",
      orderList
    );
  }

  async deleteOrder(order: DeviceOrder): Promise<void> {
    await this.sendRecv(
      "DEVICE_ORDERLIST_DELETE_REQ",
      "DEVICE_ORDERLIST_DELETE_RSP",
      { orderId: order.id.value, mode: 1 }
    );
  }

  async mopClean(): Promise<void> {
    await this.setMode(new DeviceMode({ value: DeviceMode.VALUE.MOP }));

    await waitFor(() => this.device.mode?.value === DeviceMode.VALUE.MOP, {
      timeout: MODE_CHANGE_TIMEOUT,
    }).catch(() => {
      throw new DomainException("Unable to change robot to mop mode");
    });

    await this.sendRecv(
      "DEVICE_MOP_FLOOR_CLEAN_REQ",
      "DEVICE_MOP_FLOOR_CLEAN_RSP",
      { ctrlValue: CTRL_VALUE.START }
    );
  }

  async cleanPosition(position: Position): Promise<void> {
    if (!this.device.map) {
      throw new DomainException("Unable to set robot position: map not loaded");
    }

    if (this.device.mode?.value !== DeviceMode.VALUE.SPOT) {
      await this.setMode(new DeviceMode({ value: DeviceMode.VALUE.SPOT }));

      await waitFor(() => this.device.mode?.value === DeviceMode.VALUE.SPOT, {
        timeout: MODE_CHANGE_TIMEOUT,
      }).catch(() => {
        throw new DomainException("Unable to change robot to position mode");
      });
    }

    await this.sendRecv(
      "DEVICE_MAPID_SET_NAVIGATION_REQ",
      "DEVICE_MAPID_SET_NAVIGATION_RSP",
      {
        mapHeadId: this.device.map.id.value,
        poseX: position.x,
        poseY: position.y,
        posePhi: position.phi,
        ctrlValue: CTRL_VALUE.START,
      }
    );
  }

  /**
   * A ┌───┐ D
   *   │   │
   * B └───┘ C
   */
  async cleanAreas(areas: Coordinate[][]): Promise<void> {
    if (!this.device.map) {
      return;
    }

    if (this.device.mode?.value !== DeviceMode.VALUE.ZONE) {
      await this.setMode(new DeviceMode({ value: DeviceMode.VALUE.ZONE }));

      await waitFor(() => this.device.mode?.value === DeviceMode.VALUE.ZONE, {
        timeout: MODE_CHANGE_TIMEOUT,
      }).catch(() => {
        throw new DomainException("Unable to change robot to area mode");
      });
    }

    const req = {
      mapHeadId: this.device.map.id.value,
      planId: 0,
      cleanAreaLength: areas.length,
      cleanAreaList: areas.map((coords) => {
        return {
          cleanAreaId: ID.generate().value,
          type: 0,
          coordinateLength: coords.length,
          coordinateList: coords,
        };
      }),
    };

    await this.sendRecv(
      "DEVICE_MAPID_SET_AREA_CLEAN_INFO_REQ",
      "DEVICE_MAPID_SET_AREA_CLEAN_INFO_RSP",
      req
    );
    await this.sendRecv("DEVICE_AREA_CLEAN_REQ", "DEVICE_AREA_CLEAN_RSP", {
      ctrlValue: CTRL_VALUE.START,
    });
  }

  /**
   * A ┌───┐ D
   *   │   │
   * B └───┘ C
   */
  async setRestrictedZones(areas: Coordinate[][]): Promise<void> {
    if (!this.device.map) {
      return;
    }

    if (!areas.length) {
      areas.push([]);
    }

    if (!this.device.system.supports(DEVICE_CAPABILITY.MAP_PLANS)) {
      await this.sendRecv(
        "DEVICE_MAPID_GET_GLOBAL_INFO_REQ",
        "DEVICE_MAPID_GET_GLOBAL_INFO_RSP",
        { mask: 0xff | 0x400 }
      );
    }

    const cleanAreaList = [
      ...areas.map((coords) => ({
        cleanAreaId: ID.generate().value,
        type: 0,
        coordinateLength: coords.length,
        coordinateList: coords,
      })),
      ...this.device.map.restrictedZones.map((zone) => ({
        cleanAreaId: zone.id.value,
        type: 0,
        coordinateLength: 0,
        coordinateList: [],
      })),
    ];

    await this.sendRecv(
      "DEVICE_MAPID_SET_AREA_RESTRICTED_INFO_REQ",
      "DEVICE_MAPID_SET_AREA_RESTRICTED_INFO_RSP",
      {
        mapHeadId: this.device.map.id.value,
        planId: 0,
        cleanAreaLength: cleanAreaList.length,
        cleanAreaList,
      }
    );
  }

  async getQuietHours(): Promise<DeviceQuietHours> {
    const packet = await this.sendRecv(
      "USER_GET_DEVICE_QUIETHOURS_REQ",
      "USER_GET_DEVICE_QUIETHOURS_RSP",
      {}
    );
    const object = packet.payload.object;
    const quietHours = new DeviceQuietHours({
      isEnabled: object.isOpen,
      begin: DeviceTime.fromMinutes(object.beginTime),
      end: DeviceTime.fromMinutes(object.endTime),
    });

    this.device.config?.updateQuietHours(quietHours);

    return quietHours;
  }

  async setQuietHours(quietHours: DeviceQuietHours): Promise<void> {
    await this.sendRecv(
      "USER_SET_DEVICE_QUIETHOURS_REQ",
      "USER_SET_DEVICE_QUIETHOURS_RSP",
      {
        isOpen: quietHours.isEnabled,
        beginTime: quietHours.begin.toMinutes(),
        endTime: quietHours.end.toMinutes(),
      }
    );

    this.device.config?.updateQuietHours(quietHours);
  }

  async setCarpetMode(enable: boolean): Promise<void> {
    await this.sendRecv(
      "USER_SET_DEVICE_CLEANPREFERENCE_REQ",
      "USER_SET_DEVICE_CLEANPREFERENCE_RSP",
      {
        carpetTurbo: enable,
      }
    );

    this.device.config?.updateCarpetMode(enable);
    this.emit("updateDevice");
  }

  async setHistoryMap(enable: boolean): Promise<void> {
    await this.sendRecv(
      "USER_SET_DEVICE_CLEANPREFERENCE_REQ",
      "USER_SET_DEVICE_CLEANPREFERENCE_RSP",
      {
        historyMap: enable,
      }
    );

    this.device.config?.updateHistoryMap(enable);
    this.emit("updateDevice");
  }

  async setVoice(voice: DeviceVoice): Promise<void> {
    const robotVoice = DeviceVoiceMapper.toRobot(voice);

    await this.sendRecv(
      "USER_SET_DEVICE_CTRL_SETTING_REQ",
      "USER_SET_DEVICE_CTRL_SETTING_RSP",
      {
        voiceMode: robotVoice.isEnabled,
        volume: robotVoice.volume,
      }
    );

    this.device.config?.updateVoice(voice);
    this.emit("updateDevice");
  }

  async saveWaitingMap(save: boolean): Promise<void> {
    await this.sendRecv(
      "DEVICE_MAPID_SET_SAVEWAITINGMAP_INFO_REQ",
      "DEVICE_MAPID_SET_SAVEWAITINGMAP_INFO_RSP",
      { mode: Number(save) }
    );
  }

  async updateRoom(room: Room): Promise<void> {
    if (!this.device.map) {
      return;
    }

    const { id, restrictedZones } = this.device.map;

    await this.sendRecv(
      "DEVICE_MAPID_SET_PLAN_PARAMS_REQ",
      "DEVICE_MAPID_SET_PLAN_PARAMS_RSP",
      {
        mapHeadId: id.value,
        // FIXME: this will change user map name.
        mapName: "Default",
        planId: 2,
        // FIXME: this will change user plan name.
        planName: "Default",
        roomList: this.device.map.rooms.map((r) => {
          r = room.equals(r) ? room : r;

          return {
            roomId: r.id.value,
            roomName: r.name,
            enable: true,
          };
        }),
        areaInfo: {
          mapHeadId: id.value,
          planId: 2,
          cleanAreaLength: restrictedZones.length,
          cleanAreaList: restrictedZones.map((zone) => ({
            cleanAreaId: zone.id.value,
            type: 0,
            coordinateLength: zone.coordinates.length,
            coordinateList: zone.coordinates.map(({ x, y }) => ({ x, y })),
          })),
        },
      }
    );
  }

  async joinRooms(rooms: Room[]): Promise<void> {
    if (!this.device.map) {
      return;
    }

    const stream = new BufferWriter();

    writeByte(stream, 1);
    writeByte(stream, rooms.length);

    rooms.forEach((room) => {
      writeByte(stream, room.id.value);
    });

    const data = stream.buffer;

    await this.sendRecv(
      "DEVICE_MAPID_SET_ARRANGEROOM_INFO_REQ",
      "DEVICE_MAPID_SET_ARRANGEROOM_INFO_RSP",
      {
        mapHeadId: this.device.map.id.value,
        type: 0,
        dataLen: data.length,
        data,
        roomId: 0,
      }
    );
  }

  async splitRoom(
    room: Room,
    pointA: Coordinate,
    pointB: Coordinate
  ): Promise<void> {
    if (!this.device.map) {
      return;
    }

    const stream = new BufferWriter();

    writeByte(stream, 1);
    writeByte(stream, 1);
    writeByte(stream, 2);
    writeFloat(stream, pointA.x);
    writeFloat(stream, pointA.y);
    writeFloat(stream, pointB.x);
    writeFloat(stream, pointB.y);

    const data = stream.buffer;

    await this.sendRecv(
      "DEVICE_MAPID_SET_ARRANGEROOM_INFO_REQ",
      "DEVICE_MAPID_SET_ARRANGEROOM_INFO_RSP",
      {
        mapHeadId: this.device.map.id.value,
        type: 1,
        dataLen: data.length,
        data,
        roomId: room.id.value,
      }
    );
  }

  async cleanRooms(rooms: Room[]): Promise<void> {
    if (!this.device.map) {
      return;
    }

    const { id, restrictedZones } = this.device.map;

    await this.sendRecv(
      "DEVICE_MAPID_SET_PLAN_PARAMS_REQ",
      "DEVICE_MAPID_SET_PLAN_PARAMS_RSP",
      {
        mapHeadId: id.value,
        // FIXME: this will change user map name.
        mapName: "Default",
        planId: 2,
        // FIXME: this will change user plan name.
        planName: "Default",
        roomList: this.device.map.rooms.map((room) => ({
          roomId: room.id.value,
          roomName: room.name,
          enable: Boolean(rooms.find((r) => room.equals(r))),
        })),
        areaInfo: {
          mapHeadId: id.value,
          planId: 2,
          cleanAreaLength: restrictedZones.length,
          cleanAreaList: restrictedZones.map((zone) => ({
            cleanAreaId: zone.id.value,
            type: 0,
            coordinateLength: zone.coordinates.length,
            coordinateList: zone.coordinates.map(({ x, y }) => ({ x, y })),
          })),
        },
      }
    );

    await this.sendRecv(
      "DEVICE_MAPID_GET_GLOBAL_INFO_REQ",
      "DEVICE_MAPID_GET_GLOBAL_INFO_RSP",
      { mask: 0x800 }
    );

    await this.sendRecv("DEVICE_AUTO_CLEAN_REQ", "DEVICE_AUTO_CLEAN_RSP", {
      ctrlValue: CTRL_VALUE.START,
      cleanType: 2,
    });
  }

  async resetMap(): Promise<void> {
    await this.sendRecv(
      "DEVICE_MAPID_SET_HISTORY_MAP_ENABLE_REQ",
      "DEVICE_MAPID_SET_HISTORY_MAP_ENABLE_RSP",
      {}
    );
  }

  async controlLock(): Promise<void> {
    await this.sendRecv(
      "DEVICE_CONTROL_LOCK_REQ",
      "DEVICE_CONTROL_LOCK_RSP",
      {}
    );
  }

  async handshake(): Promise<void> {
    await this.controlLock();

    this.send("DEVICE_STATUS_GETTING_REQ", {});

    void this.send("DEVICE_GET_ALL_GLOBAL_MAP_INFO_REQ", {
      unk1: 0,
      unk2: "",
    });

    void this.getTime();
    void this.updateMap();
    void this.getWlan();
  }

  @bind
  handleDeviceVersionInfoUpdate(
    message: Message<"DEVICE_VERSION_INFO_UPDATE_REQ">
  ): void {
    const object = message.packet.payload.object;

    this.device.updateVersion(
      new DeviceVersion({
        software: object.softwareVersion,
        hardware: object.hardwareVersion,
      })
    );
    this.emit("updateDevice");

    message.respond("DEVICE_VERSION_INFO_UPDATE_RSP", {
      result: 0,
    });
  }

  @bind
  handleDeviceAgentSetting(
    message: Message<"PUSH_DEVICE_AGENT_SETTING_REQ">
  ): void {
    const object = message.packet.payload.object;
    const props = {
      voice: DeviceVoiceMapper.toDomain({
        isEnabled: object.voice.voiceMode || false,
        volume: object.voice.volume || 1,
      }),
      quietHours: new DeviceQuietHours({
        isEnabled: object.quietHours.isOpen,
        begin: DeviceTime.fromMinutes(object.quietHours.beginTime),
        end: DeviceTime.fromMinutes(object.quietHours.endTime),
      }),
      isEcoModeEnabled: object.cleanPreference.ecoMode || false,
      isRepeatCleanEnabled: object.cleanPreference.repeatClean || false,
      isBrokenCleanEnabled: object.cleanPreference.cleanBroken || false,
      isCarpetModeEnabled: object.cleanPreference.carpetTurbo || false,
      isHistoryMapEnabled: object.cleanPreference.historyMap || false,
    };

    this.device.updateConfig(new DeviceConfig(props));

    message.respond("PUSH_DEVICE_AGENT_SETTING_RSP", {
      result: 0,
    });
  }

  @bind
  handleClientHeartbeat(message: Message<"CLIENT_HEARTBEAT_REQ">): void {
    message.respond("CLIENT_HEARTBEAT_RSP", {});
  }

  @bind
  handleDevicePackageUpgrade(
    message: Message<"PUSH_DEVICE_PACKAGE_UPGRADE_INFO_REQ">
  ): void {
    message.respond("PUSH_DEVICE_PACKAGE_UPGRADE_INFO_RSP", {
      result: 0,
    });
  }

  @bind
  handleDeviceStatus(
    message: Message<"DEVICE_MAPID_WORK_STATUS_PUSH_REQ">
  ): void {
    const object = message.packet.payload.object;
    const {
      battery,
      type,
      workMode,
      chargeStatus,
      cleanPreference,
      faultCode,
      waterLevel,
      mopType,
    } = object;

    this.device.updateCurrentClean(
      new DeviceCurrentClean({
        size: object.cleanSize,
        time: object.cleanTime,
      })
    );
    this.device.updateState(
      DeviceStateMapper.toDomain({ type, workMode, chargeStatus })
    );
    this.device.updateMode(DeviceModeMapper.toDomain(workMode));
    this.device.updateError(DeviceErrorMapper.toDomain(faultCode));
    this.device.updateBattery(DeviceBatteryMapper.toDomain(battery));
    this.device.updateFanSpeed(DeviceFanSpeedMapper.toDomain(cleanPreference));

    if (mopType) {
      this.device.updateHasMopAttached(mopType);
    }

    if (waterLevel) {
      this.device.updateWaterLevel(DeviceWaterLevelMapper.toDomain(waterLevel));
    }

    this.emit("updateDevice");
  }

  @bind
  handleMapUpdate(
    message: Message<
      "DEVICE_MAPID_PUSH_MAP_INFO" | "DEVICE_MAPID_GET_GLOBAL_INFO_RSP"
    >
  ): void {
    const object = message.packet.payload.object;
    const {
      statusInfo,
      mapHeadInfo,
      mapGrid,
      historyHeadInfo,
      robotPoseInfo,
      robotChargeInfo,
      cleanRoomList,
      roomSegmentList,
      wallListInfo,
      spotInfo,
    } = object;

    if (statusInfo) {
      const {
        batteryPercent: battery,
        faultType: type,
        workingMode: workMode,
        chargeState: chargeStatus,
        cleanPreference,
        faultCode,
      } = statusInfo;

      this.device.updateCurrentClean(
        new DeviceCurrentClean({
          size: statusInfo.cleanSize,
          time: statusInfo.cleanTime,
        })
      );
      this.device.updateBattery(DeviceBatteryMapper.toDomain(battery));
      this.device.updateMode(DeviceModeMapper.toDomain(workMode));
      this.device.updateState(
        DeviceStateMapper.toDomain({ type, workMode, chargeStatus })
      );
      this.device.updateError(DeviceErrorMapper.toDomain(faultCode));
      this.device.updateFanSpeed(
        DeviceFanSpeedMapper.toDomain(cleanPreference)
      );
      this.emit("updateDevice");
    }

    let map = this.device.map;

    if (mapHeadInfo && mapGrid) {
      const props = {
        id: new ID(mapHeadInfo.mapHeadId),
        size: new Pixel({
          x: mapHeadInfo.sizeX,
          y: mapHeadInfo.sizeY,
        }),
        min: new Coordinate({
          x: mapHeadInfo.minX,
          y: mapHeadInfo.minY,
        }),
        max: new Coordinate({
          x: mapHeadInfo.maxX,
          y: mapHeadInfo.maxY,
        }),
        grid: mapGrid,
        rooms: [],
        restrictedZones: [],
        robotPath: [],
      };

      map = map ? map.clone(props) : new DeviceMap(props);

      this.device.updateMap(map);
    }

    if (map) {
      if (historyHeadInfo) {
        map.updateRobotPath(
          historyHeadInfo.pointList.map(({ x, y }) => new Coordinate({ x, y }))
        );
      }

      if (robotPoseInfo) {
        map.updateRobot(
          new Position({
            x: robotPoseInfo.poseX,
            y: robotPoseInfo.poseY,
            phi: robotPoseInfo.posePhi,
          })
        );
      }

      if (robotChargeInfo) {
        map.updateCharger(
          new Position({
            x: robotChargeInfo.poseX,
            y: robotChargeInfo.poseY,
            phi: robotChargeInfo.posePhi,
          })
        );
      }

      if (spotInfo) {
        map.updateCurrentSpot(
          new Position({
            x: spotInfo.poseX,
            y: spotInfo.poseY,
            phi: spotInfo.posePhi,
          })
        );
      }

      if (wallListInfo) {
        map.updateRestrictedZones(
          wallListInfo.cleanAreaList.map((cleanArea) => {
            return new Zone({
              id: new ID(cleanArea.cleanAreaId),
              coordinates: cleanArea.coordinateList.map(({ x, y }) => {
                return new Coordinate({
                  x,
                  y,
                });
              }),
            });
          })
        );
      }

      if (cleanRoomList && roomSegmentList) {
        map.updateRooms(
          cleanRoomList
            .map((cleanRoom) => {
              const segment = roomSegmentList.find(
                (roomSegment) => roomSegment.roomId === cleanRoom.roomId
              );

              if (!segment) {
                return undefined;
              }

              return new Room({
                id: new ID(cleanRoom.roomId),
                name: cleanRoom.roomName,
                center: new Coordinate({
                  x: cleanRoom.roomX,
                  y: cleanRoom.roomY,
                }),
                pixels: segment?.roomPixelList.map((pixel) => {
                  return new Pixel({
                    x: pixel.x,
                    y: pixel.y,
                  });
                }),
              });
            })
            .filter(isPresent)
        );
      }
    }

    this.emit("updateMap");
  }

  @bind
  handleUpdateRobotPosition(
    message: Message<"DEVICE_MAPID_PUSH_POSITION_INFO">
  ): void {
    if (!this.device.map) {
      return;
    }

    const object = message.packet.payload.object;

    this.device.map.updateRobot(
      new Position({
        x: object.poseX,
        y: object.poseY,
        phi: object.posePhi,
      })
    );
    this.emit("updateRobotPosition");
  }

  @bind
  handleUpdateChargePosition(
    message: Message<"DEVICE_MAPID_PUSH_CHARGE_POSITION_INFO">
  ): void {
    if (!this.device.map) {
      return;
    }

    const object = message.packet.payload.object;

    this.device.map.updateCharger(
      new Position({
        x: object.poseX,
        y: object.poseY,
        phi: object.posePhi,
      })
    );
    this.emit("updateChargerPosition");
  }

  @bind
  handleDeviceBatteryInfo(
    message: Message<"PUSH_DEVICE_BATTERY_INFO_REQ">
  ): void {
    message.respond("PUSH_DEVICE_BATTERY_INFO_RSP", {
      result: 0,
    });

    const object = message.packet.payload.object;

    this.device.updateBattery(
      DeviceBatteryMapper.toDomain(object.battery.level)
    );

    this.emit("updateDevice");
  }

  @bind
  handleWaitingMap(): void {
    void this.saveWaitingMap(
      !this.device.map || this.device.map.id.value === 0
    );
  }

  @bind
  handleWorkstatusReport(
    message: Message<"DEVICE_WORKSTATUS_REPORT_REQ">
  ): void {
    message.respond("DEVICE_WORKSTATUS_REPORT_RSP", {
      result: 0,
    });
  }

  @bind
  handleReportCleantask(
    message: Message<"DEVICE_EVENT_REPORT_CLEANTASK">
  ): void {
    message.respond("UNK_11A4", { unk1: 0 });
  }

  @bind
  handleReportCleanmap(message: Message<"DEVICE_EVENT_REPORT_CLEANMAP">): void {
    const object = message.packet.payload.object;
    message.respond("DEVICE_EVENT_REPORT_RSP", {
      result: 0,
      body: {
        cleanId: object.cleanId,
      },
    });
  }

  @bind
  handleBinDataReport(
    message: Message<"DEVICE_CLEANMAP_BINDATA_REPORT_REQ">
  ): void {
    const object = message.packet.payload.object;
    message.respond("DEVICE_CLEANMAP_BINDATA_REPORT_RSP", {
      result: 0,
      cleanId: object.cleanId,
    });
  }

  @bind
  handleEventReport(message: Message<"DEVICE_EVENT_REPORT_REQ">): void {
    message.respond("UNK_11A7", { unk1: 0 });
  }

  addConnection(connection: Connection): void {
    const added = this.multiplexer.addConnection(connection);

    if (added && this.multiplexer.connectionCount === 2) {
      void this.handshake();
    }
  }

  handleMessage<Name extends OPDecoderLiteral>(message: Message<Name>): void {
    const handler = this.handlers[message.opname] as
      | MessageHandler<Name>
      | undefined;

    if (
      message.packet.userId.value !== 0 &&
      message.packet.userId.value !== this.user.id.value
    ) {
      message.respond("COMMON_ERROR_REPLY", {
        result: 11001,
        error: "Target user is offline",
        opcode: message.packet.payload.opcode.value,
      });
      return;
    }

    if (handler) {
      handler(message);
    } else {
      this.debug(`unhandled opcode ${message.opname}`);
    }
  }

  toString(): string {
    return [
      `device: ${this.device.toString()}`,
      `user: ${this.user.toString()}`,
    ].join(" ");
  }

  disconnect(): void {
    this.debug("disconnecting...");

    return this.multiplexer.close();
  }

  send<Name extends OPDecoderLiteral>(
    opname: Name,
    object: OPDecoders[Name]
  ): void {
    const ret = this.multiplexer.send({
      opname,
      userId: this.user.id,
      deviceId: this.device.id,
      object,
    });

    if (!ret) {
      throw new DomainException(
        `There was an error sending opcode '${opname}'`
      );
    }
  }

  recv<Name extends OPDecoderLiteral>(opname: Name): Promise<Packet<Name>> {
    return new Promise((resolve, reject) => {
      const done = (packet: Packet<OPDecoderLiteral>) => {
        clearTimeout(timer);
        resolve(packet as Packet<Name>);
      };

      const fail = () => {
        this.multiplexer.off(opname, done);
        reject(
          new DomainException(
            `Timeout waiting for response from opcode '${opname}'`
          )
        );
      };

      const timer = setTimeout(fail, RECV_TIMEOUT);

      this.multiplexer.once(opname, done);
    });
  }

  sendRecv<
    SendName extends OPDecoderLiteral,
    RecvName extends OPDecoderLiteral
  >(
    sendOPName: SendName,
    recvOPName: RecvName,
    sendObject: OPDecoders[SendName]
  ): Promise<Packet<RecvName>> {
    this.send(sendOPName, sendObject);

    return this.recv(recvOPName);
  }
}
