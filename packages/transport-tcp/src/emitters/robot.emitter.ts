/* eslint-disable @typescript-eslint/unbound-method */
import {
  DeviceMode,
  DeviceCapability,
  DeviceConsumable,
  DeviceWlan,
  MapPosition,
  MapCoordinate,
  QuietHoursSetting,
  DeviceTime,
  Room,
  DeviceVersion,
  DeviceSettings,
  DeviceCleanWork,
  MapPixel,
  DeviceMap,
  Zone,
  DeviceModeValue,
  DeviceConsumableType,
  DeviceStateValue,
  CleanSize,
  DeviceSetting,
} from '@agnoc/domain';
import {
  ArgumentInvalidException,
  waitFor,
  DomainException,
  ID,
  writeByte,
  writeFloat,
  isPresent,
  debug,
  bind,
  BufferWriter,
} from '@agnoc/toolkit';
import { TypedEmitter } from 'tiny-typed-emitter';
import { DeviceBatteryMapper } from '../mappers/device-battery.mapper';
import { DeviceErrorMapper } from '../mappers/device-error.mapper';
import { DeviceFanSpeedMapper } from '../mappers/device-fan-speed.mapper';
import { DeviceModeMapper } from '../mappers/device-mode.mapper';
import { DeviceOrderMapper } from '../mappers/device-order.mapper';
import { DeviceStateMapper } from '../mappers/device-state.mapper';
import { DeviceVoiceMapper } from '../mappers/device-voice.mapper';
import { DeviceWaterLevelMapper } from '../mappers/device-water-level.mapper';
import type { Connection } from './connection.emitter';
import type { Multiplexer } from './multiplexer.emitter';
import type { OPDecoderLiteral, OPDecoders } from '../constants/opcodes.constant';
import type { Message, MessageHandlers } from '../value-objects/message.value-object';
import type { Packet } from '../value-objects/packet.value-object';
import type {
  Device,
  User,
  DeviceFanSpeed,
  DeviceWaterLevel,
  DeviceOrder,
  VoiceSetting,
  DeviceSettingsProps,
} from '@agnoc/domain';
import type { Debugger } from 'debug';

export interface RobotProps {
  device: Device;
  user: User;
  multiplexer: Multiplexer;
}

export interface DeviceTimestamp {
  timestamp: number;
  offset: number;
}

export interface RobotEvents {
  updateDevice: () => void;
  updateMap: () => void;
  updateRobotPosition: () => void;
  updateChargerPosition: () => void;
}

export enum MANUAL_MODE {
  'forward' = 1,
  'left' = 2,
  'right' = 3,
  'backward' = 4,
  'stop' = 5,
  'init' = 10,
}

export type ManualMode = (typeof MANUAL_MODE)[keyof typeof MANUAL_MODE];

const MODE_CHANGE_TIMEOUT = 5000;
const RECV_TIMEOUT = 5000;

const CONSUMABLE_TYPE_RESET = {
  [DeviceConsumableType.MainBrush]: 1,
  [DeviceConsumableType.SideBrush]: 2,
  [DeviceConsumableType.Filter]: 3,
  [DeviceConsumableType.Dishcloth]: 4,
};

const CTRL_VALUE = {
  STOP: 0,
  START: 1,
  PAUSE: 2,
};

// TODO: move to constructor
const deviceFanSpeedMapper = new DeviceFanSpeedMapper();
const deviceWaterLevelMapper = new DeviceWaterLevelMapper();
const deviceOrderMapper = new DeviceOrderMapper(deviceFanSpeedMapper, deviceWaterLevelMapper);
const deviceVoiceMapper = new DeviceVoiceMapper();
const deviceStateMapper = new DeviceStateMapper();
const deviceModeMapper = new DeviceModeMapper();
const deviceErrorMapper = new DeviceErrorMapper();
const deviceBatteryMapper = new DeviceBatteryMapper();

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
    DEVICE_SETTIME_REQ: this.handleSetTime,
  };

  constructor({ device, user, multiplexer }: RobotProps) {
    super();
    this.device = device;
    this.user = user;
    this.multiplexer = multiplexer;
    this.debug = debug(__filename).extend(this.device.id.toString());
    this.debug('new robot');
  }

  get isConnected(): boolean {
    return this.multiplexer.hasConnections;
  }

  async start(): Promise<void> {
    if (this.device.hasMopAttached && this.device.mode?.value !== DeviceModeValue.Mop) {
      await this.setMode(new DeviceMode(DeviceModeValue.Mop));
    } else if (!this.device.hasMopAttached && this.device.mode?.value === DeviceModeValue.Mop) {
      await this.setMode(new DeviceMode(DeviceModeValue.None));
    }

    if (this.device.mode?.value === DeviceModeValue.Zone) {
      await this.sendRecv('DEVICE_AREA_CLEAN_REQ', 'DEVICE_AREA_CLEAN_RSP', {
        ctrlValue: CTRL_VALUE.START,
      });
    } else if (this.device.mode?.value === DeviceModeValue.Mop) {
      await this.sendRecv('DEVICE_MOP_FLOOR_CLEAN_REQ', 'DEVICE_MOP_FLOOR_CLEAN_RSP', {
        ctrlValue: CTRL_VALUE.START,
      });
    } else if (this.device.mode?.value === DeviceModeValue.Spot && this.device.map?.currentSpot) {
      await this.sendRecv('DEVICE_MAPID_SET_NAVIGATION_REQ', 'DEVICE_MAPID_SET_NAVIGATION_RSP', {
        mapHeadId: this.device.map.id.value,
        poseX: this.device.map.currentSpot.x,
        poseY: this.device.map.currentSpot.y,
        posePhi: this.device.map.currentSpot.phi,
        ctrlValue: CTRL_VALUE.START,
      });
    } else {
      if (
        this.device.system.supports(DeviceCapability.MAP_PLANS) &&
        this.device.state?.value === DeviceStateValue.Docked &&
        this.device.map
      ) {
        const { id, restrictedZones } = this.device.map;

        await this.sendRecv('DEVICE_MAPID_SET_PLAN_PARAMS_REQ', 'DEVICE_MAPID_SET_PLAN_PARAMS_RSP', {
          mapHeadId: id.value,
          // FIXME: this will change user map name.
          mapName: 'Default',
          planId: 2,
          // FIXME: this will change user plan name.
          planName: 'Default',
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
        });
      }

      await this.sendRecv('DEVICE_AUTO_CLEAN_REQ', 'DEVICE_AUTO_CLEAN_RSP', {
        ctrlValue: CTRL_VALUE.START,
        cleanType: 2,
      });
    }
  }

  async pause(): Promise<void> {
    if (this.device.mode?.value === DeviceModeValue.Zone) {
      await this.sendRecv('DEVICE_AREA_CLEAN_REQ', 'DEVICE_AREA_CLEAN_RSP', {
        ctrlValue: CTRL_VALUE.PAUSE,
      });
    } else if (this.device.mode?.value === DeviceModeValue.Mop) {
      await this.sendRecv('DEVICE_MOP_FLOOR_CLEAN_REQ', 'DEVICE_MOP_FLOOR_CLEAN_RSP', {
        ctrlValue: CTRL_VALUE.PAUSE,
      });
    } else if (this.device.mode?.value === DeviceModeValue.Spot && this.device.map?.currentSpot) {
      await this.sendRecv('DEVICE_MAPID_SET_NAVIGATION_REQ', 'DEVICE_MAPID_SET_NAVIGATION_RSP', {
        mapHeadId: this.device.map.id.value,
        poseX: this.device.map.currentSpot.x,
        poseY: this.device.map.currentSpot.y,
        posePhi: this.device.map.currentSpot.phi,
        ctrlValue: CTRL_VALUE.PAUSE,
      });
    } else {
      await this.sendRecv('DEVICE_AUTO_CLEAN_REQ', 'DEVICE_AUTO_CLEAN_RSP', {
        ctrlValue: CTRL_VALUE.PAUSE,
        cleanType: 2,
      });
    }
  }

  async stop(): Promise<void> {
    await this.sendRecv('DEVICE_AUTO_CLEAN_REQ', 'DEVICE_AUTO_CLEAN_RSP', {
      ctrlValue: CTRL_VALUE.STOP,
      cleanType: 2,
    });

    if (this.device.system.supports(DeviceCapability.MAP_PLANS) && this.device.map) {
      const { id, restrictedZones } = this.device.map;

      await this.sendRecv('DEVICE_MAPID_SET_PLAN_PARAMS_REQ', 'DEVICE_MAPID_SET_PLAN_PARAMS_RSP', {
        mapHeadId: id.value,
        // FIXME: this will change user map name.
        mapName: 'Default',
        planId: 2,
        // FIXME: this will change user plan name.
        planName: 'Default',
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
      });

      await this.updateMap();
    }
  }

  async home(): Promise<void> {
    await this.sendRecv('DEVICE_CHARGE_REQ', 'DEVICE_CHARGE_RSP', {
      enable: 1,
    });
  }

  async locate(): Promise<void> {
    await this.sendRecv('DEVICE_SEEK_LOCATION_REQ', 'DEVICE_SEEK_LOCATION_RSP', {});
  }

  async setMode(mode: DeviceMode): Promise<void> {
    if (mode.value === DeviceModeValue.None) {
      await this.sendRecv('DEVICE_AUTO_CLEAN_REQ', 'DEVICE_AUTO_CLEAN_RSP', {
        ctrlValue: CTRL_VALUE.STOP,
        cleanType: 2,
      });
    } else if (mode.value === DeviceModeValue.Spot) {
      let mask = 0x78ff | 0x200;

      if (!this.device.system.supports(DeviceCapability.MAP_PLANS)) {
        mask = 0xff | 0x200;
      }

      await this.sendRecv('DEVICE_MAPID_GET_GLOBAL_INFO_REQ', 'DEVICE_MAPID_GET_GLOBAL_INFO_RSP', { mask });
    } else if (mode.value === DeviceModeValue.Zone) {
      await this.sendRecv('DEVICE_AREA_CLEAN_REQ', 'DEVICE_AREA_CLEAN_RSP', {
        ctrlValue: CTRL_VALUE.STOP,
      });

      let mask = 0x78ff | 0x100;

      if (!this.device.system.supports(DeviceCapability.MAP_PLANS)) {
        mask = 0xff | 0x100;
      }

      await this.sendRecv('DEVICE_MAPID_GET_GLOBAL_INFO_REQ', 'DEVICE_MAPID_GET_GLOBAL_INFO_RSP', { mask });
    } else if (mode.value === DeviceModeValue.Mop) {
      await this.sendRecv('DEVICE_MAPID_INTO_MODEIDLE_INFO_REQ', 'DEVICE_MAPID_INTO_MODEIDLE_INFO_RSP', {
        mode: 7,
      });
    } else {
      throw new ArgumentInvalidException('Unknown device mode');
    }

    await waitFor(() => this.device.mode?.value === mode.value, {
      timeout: MODE_CHANGE_TIMEOUT,
    }).catch(() => {
      throw new DomainException(`Unable to change robot mode to ${mode.value}`);
    });
  }

  async setFanSpeed(fanSpeed: DeviceFanSpeed): Promise<void> {
    await this.sendRecv('DEVICE_SET_CLEAN_PREFERENCE_REQ', 'DEVICE_SET_CLEAN_PREFERENCE_RSP', {
      mode: deviceFanSpeedMapper.fromDomain(fanSpeed),
    });
  }

  async setWaterLevel(waterLevel: DeviceWaterLevel): Promise<void> {
    await this.sendRecv('DEVICE_SET_CLEAN_PREFERENCE_REQ', 'DEVICE_SET_CLEAN_PREFERENCE_RSP', {
      mode: deviceWaterLevelMapper.fromDomain(waterLevel),
    });
  }

  async getTime(): Promise<DeviceTimestamp> {
    const packet = await this.sendRecv('DEVICE_GETTIME_REQ', 'DEVICE_GETTIME_RSP', {});
    const object = packet.payload.object;

    return {
      timestamp: object.body.deviceTime * 1000,
      offset: -1 * ((object.body.deviceTimezone || 0) / 60),
    };
  }

  async getConsumables(): Promise<DeviceConsumable[]> {
    if (!this.device.system.supports(DeviceCapability.CONSUMABLES)) {
      return [];
    }

    const packet = await this.sendRecv(
      'DEVICE_MAPID_GET_CONSUMABLES_PARAM_REQ',
      'DEVICE_MAPID_GET_CONSUMABLES_PARAM_RSP',
      {},
    );
    const object = packet.payload.object;
    const consumables = [
      new DeviceConsumable({
        type: DeviceConsumableType.MainBrush,
        minutesUsed: object.mainBrushTime,
      }),
      new DeviceConsumable({
        type: DeviceConsumableType.SideBrush,
        minutesUsed: object.sideBrushTime,
      }),
      new DeviceConsumable({
        type: DeviceConsumableType.Filter,
        minutesUsed: object.filterTime,
      }),
      new DeviceConsumable({
        type: DeviceConsumableType.Dishcloth,
        minutesUsed: object.dishclothTime,
      }),
    ];

    this.device.updateConsumables(consumables);

    return consumables;
  }

  async resetConsumable(consumable: DeviceConsumableType): Promise<void> {
    if (!(consumable in CONSUMABLE_TYPE_RESET)) {
      throw new ArgumentInvalidException('Invalid consumable');
    }

    const itemId = CONSUMABLE_TYPE_RESET[consumable];

    await this.sendRecv('DEVICE_MAPID_SET_CONSUMABLES_PARAM_REQ', 'DEVICE_MAPID_SET_CONSUMABLES_PARAM_RSP', { itemId });
  }

  async updateMap(): Promise<void> {
    let mask = 0x78ff;

    if (!this.device.system.supports(DeviceCapability.MAP_PLANS)) {
      mask = 0xff;
    }

    await this.sendRecv('DEVICE_MAPID_GET_GLOBAL_INFO_REQ', 'DEVICE_MAPID_GET_GLOBAL_INFO_RSP', { mask });
  }

  async getWlan(): Promise<DeviceWlan> {
    const packet = await this.sendRecv('DEVICE_WLAN_INFO_GETTING_REQ', 'DEVICE_WLAN_INFO_GETTING_RSP', {});
    const object = packet.payload.object;

    this.device.updateWlan(new DeviceWlan(object.body));
    this.emit('updateDevice');

    return this.device.wlan as DeviceWlan;
  }

  async enterManualMode(): Promise<void> {
    // TODO: make a stop if robot is not stopped
    await this.sendRecv('DEVICE_MANUAL_CTRL_REQ', 'DEVICE_MANUAL_CTRL_RSP', {
      command: MANUAL_MODE.init,
    });
  }

  async leaveManualMode(): Promise<void> {
    await this.sendRecv('DEVICE_AUTO_CLEAN_REQ', 'DEVICE_AUTO_CLEAN_RSP', {
      ctrlValue: CTRL_VALUE.STOP,
      cleanType: 2,
    });
  }

  async setManualMode(command: ManualMode): Promise<void> {
    await this.sendRecv('DEVICE_MANUAL_CTRL_REQ', 'DEVICE_MANUAL_CTRL_RSP', {
      command,
    });
  }

  async getOrders(): Promise<DeviceOrder[]> {
    const packet = await this.sendRecv('DEVICE_ORDERLIST_GETTING_REQ', 'DEVICE_ORDERLIST_GETTING_RSP', {});
    const object = packet.payload.object;
    const orders = object.orderList?.map(deviceOrderMapper.toDomain) || [];

    this.device.updateOrders(orders);

    return orders;
  }

  async setOrder(order: DeviceOrder): Promise<void> {
    const orderList = deviceOrderMapper.fromDomain(order);

    await this.sendRecv('DEVICE_ORDERLIST_SETTING_REQ', 'DEVICE_ORDERLIST_SETTING_RSP', orderList);
  }

  async deleteOrder(order: DeviceOrder): Promise<void> {
    await this.sendRecv('DEVICE_ORDERLIST_DELETE_REQ', 'DEVICE_ORDERLIST_DELETE_RSP', {
      orderId: order.id.value,
      mode: 1,
    });
  }

  async cleanPosition(position: MapPosition): Promise<void> {
    if (!this.device.map) {
      throw new DomainException('Unable to set robot position: map not loaded');
    }

    if (this.device.mode?.value !== DeviceModeValue.Spot) {
      await this.setMode(new DeviceMode(DeviceModeValue.Spot));
    }

    await this.sendRecv('DEVICE_MAPID_SET_NAVIGATION_REQ', 'DEVICE_MAPID_SET_NAVIGATION_RSP', {
      mapHeadId: this.device.map.id.value,
      poseX: position.x,
      poseY: position.y,
      posePhi: position.phi,
      ctrlValue: CTRL_VALUE.START,
    });
  }

  /**
   * A ┌───┐ D
   *   │   │
   * B └───┘ C
   */
  async cleanAreas(areas: MapCoordinate[][]): Promise<void> {
    if (!this.device.map) {
      return;
    }

    if (this.device.mode?.value !== DeviceModeValue.Zone) {
      await this.setMode(new DeviceMode(DeviceModeValue.Zone));
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

    await this.sendRecv('DEVICE_MAPID_SET_AREA_CLEAN_INFO_REQ', 'DEVICE_MAPID_SET_AREA_CLEAN_INFO_RSP', req);
    await this.sendRecv('DEVICE_AREA_CLEAN_REQ', 'DEVICE_AREA_CLEAN_RSP', {
      ctrlValue: CTRL_VALUE.START,
    });
  }

  /**
   * A ┌───┐ D
   *   │   │
   * B └───┘ C
   */
  async setRestrictedZones(areas: MapCoordinate[][]): Promise<void> {
    if (!this.device.map) {
      return;
    }

    if (!areas.length) {
      areas.push([]);
    }

    if (!this.device.system.supports(DeviceCapability.MAP_PLANS)) {
      await this.sendRecv('DEVICE_MAPID_GET_GLOBAL_INFO_REQ', 'DEVICE_MAPID_GET_GLOBAL_INFO_RSP', {
        mask: 0xff | 0x400,
      });
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

    await this.sendRecv('DEVICE_MAPID_SET_AREA_RESTRICTED_INFO_REQ', 'DEVICE_MAPID_SET_AREA_RESTRICTED_INFO_RSP', {
      mapHeadId: this.device.map.id.value,
      planId: 0,
      cleanAreaLength: cleanAreaList.length,
      cleanAreaList,
    });
  }

  async getQuietHours(): Promise<QuietHoursSetting> {
    const packet = await this.sendRecv('USER_GET_DEVICE_QUIETHOURS_REQ', 'USER_GET_DEVICE_QUIETHOURS_RSP', {});
    const object = packet.payload.object;
    const quietHours = new QuietHoursSetting({
      isEnabled: object.isOpen,
      beginTime: DeviceTime.fromMinutes(object.beginTime),
      endTime: DeviceTime.fromMinutes(object.endTime),
    });

    this.device.updateConfig(this.device.config?.clone({ quietHours }));

    return quietHours;
  }

  async setQuietHours(quietHours: QuietHoursSetting): Promise<void> {
    await this.sendRecv('USER_SET_DEVICE_QUIETHOURS_REQ', 'USER_SET_DEVICE_QUIETHOURS_RSP', {
      isOpen: quietHours.isEnabled,
      beginTime: quietHours.beginTime.toMinutes(),
      endTime: quietHours.endTime.toMinutes(),
    });

    this.device.updateConfig(this.device.config?.clone({ quietHours }));
  }

  async setCarpetMode(enable: boolean): Promise<void> {
    await this.sendRecv('USER_SET_DEVICE_CLEANPREFERENCE_REQ', 'USER_SET_DEVICE_CLEANPREFERENCE_RSP', {
      carpetTurbo: enable,
    });

    this.device.updateConfig(this.device.config?.clone({ carpetMode: new DeviceSetting({ isEnabled: enable }) }));
    this.emit('updateDevice');
  }

  async setHistoryMap(enable: boolean): Promise<void> {
    await this.sendRecv('USER_SET_DEVICE_CLEANPREFERENCE_REQ', 'USER_SET_DEVICE_CLEANPREFERENCE_RSP', {
      historyMap: enable,
    });

    this.device.updateConfig(this.device.config?.clone({ historyMap: new DeviceSetting({ isEnabled: enable }) }));
    this.emit('updateDevice');
  }

  async setVoice(voice: VoiceSetting): Promise<void> {
    const robotVoice = deviceVoiceMapper.fromDomain(voice);

    await this.sendRecv('USER_SET_DEVICE_CTRL_SETTING_REQ', 'USER_SET_DEVICE_CTRL_SETTING_RSP', {
      voiceMode: robotVoice.isEnabled,
      volume: robotVoice.volume,
    });

    this.device.updateConfig(this.device.config?.clone({ voice }));
    this.emit('updateDevice');
  }

  async saveWaitingMap(save: boolean): Promise<void> {
    await this.sendRecv('DEVICE_MAPID_SET_SAVEWAITINGMAP_INFO_REQ', 'DEVICE_MAPID_SET_SAVEWAITINGMAP_INFO_RSP', {
      mode: Number(save),
    });

    this.device.updateHasWaitingMap(false);
  }

  async updateRoom(room: Room): Promise<void> {
    if (!this.device.map) {
      return;
    }

    const { id, restrictedZones } = this.device.map;

    await this.sendRecv('DEVICE_MAPID_SET_PLAN_PARAMS_REQ', 'DEVICE_MAPID_SET_PLAN_PARAMS_RSP', {
      mapHeadId: id.value,
      // FIXME: this will change user map name.
      mapName: 'Default',
      planId: 2,
      // FIXME: this will change user plan name.
      planName: 'Default',
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
    });
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

    await this.sendRecv('DEVICE_MAPID_SET_ARRANGEROOM_INFO_REQ', 'DEVICE_MAPID_SET_ARRANGEROOM_INFO_RSP', {
      mapHeadId: this.device.map.id.value,
      type: 0,
      dataLen: data.length,
      data,
      roomId: 0,
    });
  }

  async splitRoom(room: Room, pointA: MapCoordinate, pointB: MapCoordinate): Promise<void> {
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

    await this.sendRecv('DEVICE_MAPID_SET_ARRANGEROOM_INFO_REQ', 'DEVICE_MAPID_SET_ARRANGEROOM_INFO_RSP', {
      mapHeadId: this.device.map.id.value,
      type: 1,
      dataLen: data.length,
      data,
      roomId: room.id.value,
    });
  }

  async cleanRooms(rooms: Room[]): Promise<void> {
    if (!this.device.map) {
      return;
    }

    const { id, restrictedZones } = this.device.map;

    await this.sendRecv('DEVICE_MAPID_SET_PLAN_PARAMS_REQ', 'DEVICE_MAPID_SET_PLAN_PARAMS_RSP', {
      mapHeadId: id.value,
      // FIXME: this will change user map name.
      mapName: 'Default',
      planId: 2,
      // FIXME: this will change user plan name.
      planName: 'Default',
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
    });

    await this.sendRecv('DEVICE_MAPID_SELECT_MAP_PLAN_REQ', 'DEVICE_MAPID_SELECT_MAP_PLAN_RSP', {
      mapHeadId: id.value,
      planId: 2,
      mode: 1,
    });

    await this.sendRecv('DEVICE_MAPID_GET_GLOBAL_INFO_REQ', 'DEVICE_MAPID_GET_GLOBAL_INFO_RSP', { mask: 0x78ff });

    await this.sendRecv('DEVICE_AUTO_CLEAN_REQ', 'DEVICE_AUTO_CLEAN_RSP', {
      ctrlValue: CTRL_VALUE.START,
      cleanType: 2,
    });
  }

  async resetMap(): Promise<void> {
    await this.sendRecv('DEVICE_MAPID_SET_HISTORY_MAP_ENABLE_REQ', 'DEVICE_MAPID_SET_HISTORY_MAP_ENABLE_RSP', {});
  }

  async controlLock(): Promise<void> {
    await this.sendRecv('DEVICE_CONTROL_LOCK_REQ', 'DEVICE_CONTROL_LOCK_RSP', {});
  }

  async handshake(): Promise<void> {
    await this.controlLock();

    this.send('DEVICE_STATUS_GETTING_REQ', {});

    void this.send('DEVICE_GET_ALL_GLOBAL_MAP_INFO_REQ', {
      unk1: 0,
      unk2: '',
    });

    void this.getTime();
    void this.updateMap();
    void this.getWlan();
  }

  @bind
  handleDeviceVersionInfoUpdate(message: Message<'DEVICE_VERSION_INFO_UPDATE_REQ'>): void {
    const object = message.packet.payload.object;

    this.device.updateVersion(
      new DeviceVersion({
        software: object.softwareVersion,
        hardware: object.hardwareVersion,
      }),
    );
    this.emit('updateDevice');

    message.respond('DEVICE_VERSION_INFO_UPDATE_RSP', {
      result: 0,
    });
  }

  @bind
  handleDeviceAgentSetting(message: Message<'PUSH_DEVICE_AGENT_SETTING_REQ'>): void {
    const object = message.packet.payload.object;
    const props: DeviceSettingsProps = {
      voice: deviceVoiceMapper.toDomain({
        isEnabled: object.voice.voiceMode || false,
        volume: object.voice.volume || 1,
      }),
      quietHours: new QuietHoursSetting({
        isEnabled: object.quietHours.isOpen,
        beginTime: DeviceTime.fromMinutes(object.quietHours.beginTime),
        endTime: DeviceTime.fromMinutes(object.quietHours.endTime),
      }),
      ecoMode: new DeviceSetting({ isEnabled: object.cleanPreference.ecoMode ?? false }),
      repeatClean: new DeviceSetting({ isEnabled: object.cleanPreference.repeatClean ?? false }),
      brokenClean: new DeviceSetting({ isEnabled: object.cleanPreference.cleanBroken ?? false }),
      carpetMode: new DeviceSetting({ isEnabled: object.cleanPreference.carpetTurbo ?? false }),
      historyMap: new DeviceSetting({ isEnabled: object.cleanPreference.historyMap ?? false }),
    };

    this.device.updateConfig(new DeviceSettings(props));

    message.respond('PUSH_DEVICE_AGENT_SETTING_RSP', {
      result: 0,
    });
  }

  @bind
  handleClientHeartbeat(message: Message<'CLIENT_HEARTBEAT_REQ'>): void {
    message.respond('CLIENT_HEARTBEAT_RSP', {});
  }

  @bind
  handleDevicePackageUpgrade(message: Message<'PUSH_DEVICE_PACKAGE_UPGRADE_INFO_REQ'>): void {
    message.respond('PUSH_DEVICE_PACKAGE_UPGRADE_INFO_RSP', {
      result: 0,
    });
  }

  @bind
  handleDeviceStatus(message: Message<'DEVICE_MAPID_WORK_STATUS_PUSH_REQ'>): void {
    const object = message.packet.payload.object;
    const { battery, type, workMode, chargeStatus, cleanPreference, faultCode, waterLevel, mopType } = object;

    this.device.updateCurrentClean(
      new DeviceCleanWork({
        size: new CleanSize(object.cleanSize),
        time: DeviceTime.fromMinutes(object.cleanTime),
      }),
    );
    this.device.updateState(deviceStateMapper.toDomain({ type, workMode, chargeStatus }));
    this.device.updateMode(deviceModeMapper.toDomain(workMode));
    this.device.updateError(deviceErrorMapper.toDomain(faultCode));
    this.device.updateBattery(deviceBatteryMapper.toDomain(battery));
    this.device.updateFanSpeed(deviceFanSpeedMapper.toDomain(cleanPreference));

    if (isPresent(mopType)) {
      this.device.updateHasMopAttached(mopType);
    }

    if (isPresent(waterLevel)) {
      this.device.updateWaterLevel(deviceWaterLevelMapper.toDomain(waterLevel));
    }

    this.emit('updateDevice');
  }

  @bind
  handleMapUpdate(message: Message<'DEVICE_MAPID_PUSH_MAP_INFO' | 'DEVICE_MAPID_GET_GLOBAL_INFO_RSP'>): void {
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
      cleanPlanList,
      currentPlanId,
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
        new DeviceCleanWork({
          size: new CleanSize(statusInfo.cleanSize),
          time: DeviceTime.fromMinutes(statusInfo.cleanTime),
        }),
      );
      this.device.updateBattery(deviceBatteryMapper.toDomain(battery));
      this.device.updateMode(deviceModeMapper.toDomain(workMode));
      this.device.updateState(deviceStateMapper.toDomain({ type, workMode, chargeStatus }));
      this.device.updateError(deviceErrorMapper.toDomain(faultCode));
      this.device.updateFanSpeed(deviceFanSpeedMapper.toDomain(cleanPreference));
      this.emit('updateDevice');
    }

    let map = this.device.map;

    if (mapHeadInfo && mapGrid) {
      const props = {
        id: new ID(mapHeadInfo.mapHeadId),
        size: new MapPixel({
          x: mapHeadInfo.sizeX,
          y: mapHeadInfo.sizeY,
        }),
        min: new MapCoordinate({
          x: mapHeadInfo.minX,
          y: mapHeadInfo.minY,
        }),
        max: new MapCoordinate({
          x: mapHeadInfo.maxX,
          y: mapHeadInfo.maxY,
        }),
        resolution: mapHeadInfo.resolution,
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
        const currentIndex = map.robotPath.length;

        map.updateRobotPath(
          map.robotPath.concat(
            historyHeadInfo.pointList.slice(currentIndex).map(({ x, y }) => new MapCoordinate({ x, y })),
          ),
        );
      }

      if (robotPoseInfo) {
        map.updateRobot(
          new MapPosition({
            x: robotPoseInfo.poseX,
            y: robotPoseInfo.poseY,
            phi: robotPoseInfo.posePhi,
          }),
        );
      }

      if (robotChargeInfo) {
        map.updateCharger(
          new MapPosition({
            x: robotChargeInfo.poseX,
            y: robotChargeInfo.poseY,
            phi: robotChargeInfo.posePhi,
          }),
        );
      }

      if (spotInfo) {
        map.updateCurrentSpot(
          new MapPosition({
            x: spotInfo.poseX,
            y: spotInfo.poseY,
            phi: spotInfo.posePhi,
          }),
        );
      }

      if (wallListInfo) {
        map.updateRestrictedZones(
          wallListInfo.cleanAreaList.map((cleanArea) => {
            return new Zone({
              id: new ID(cleanArea.cleanAreaId),
              coordinates: cleanArea.coordinateList.map(({ x, y }) => {
                return new MapCoordinate({
                  x,
                  y,
                });
              }),
            });
          }),
        );
      }

      if (cleanRoomList && roomSegmentList && cleanPlanList) {
        const currentPlan = cleanPlanList.find((plan) => plan.planId === currentPlanId);

        map.updateRooms(
          cleanRoomList
            .map((cleanRoom) => {
              const segment = roomSegmentList.find((roomSegment) => roomSegment.roomId === cleanRoom.roomId);
              const roomInfo = currentPlan?.cleanRoomInfoList.find((r) => r.roomId === cleanRoom.roomId);

              if (!segment) {
                return undefined;
              }

              return new Room({
                id: new ID(cleanRoom.roomId),
                name: cleanRoom.roomName,
                isEnabled: Boolean(roomInfo?.enable),
                center: new MapCoordinate({
                  x: cleanRoom.roomX,
                  y: cleanRoom.roomY,
                }),
                pixels: segment?.roomPixelList.map((pixel) => {
                  return new MapPixel({
                    x: pixel.x,
                    y: pixel.y,
                  });
                }),
              });
            })
            .filter(isPresent),
        );
      }
    }

    this.emit('updateMap');
  }

  @bind
  handleUpdateRobotPosition(message: Message<'DEVICE_MAPID_PUSH_POSITION_INFO'>): void {
    if (!this.device.map) {
      return;
    }

    const object = message.packet.payload.object;

    if (object.update) {
      this.device.map.updateRobot(
        new MapPosition({
          x: object.poseX,
          y: object.poseY,
          phi: object.posePhi,
        }),
      );

      this.emit('updateRobotPosition');
    }
  }

  @bind
  handleUpdateChargePosition(message: Message<'DEVICE_MAPID_PUSH_CHARGE_POSITION_INFO'>): void {
    if (!this.device.map) {
      return;
    }

    const object = message.packet.payload.object;

    this.device.map.updateCharger(
      new MapPosition({
        x: object.poseX,
        y: object.poseY,
        phi: object.posePhi,
      }),
    );
    this.emit('updateChargerPosition');
  }

  @bind
  handleDeviceBatteryInfo(message: Message<'PUSH_DEVICE_BATTERY_INFO_REQ'>): void {
    message.respond('PUSH_DEVICE_BATTERY_INFO_RSP', {
      result: 0,
    });

    const object = message.packet.payload.object;

    this.device.updateBattery(deviceBatteryMapper.toDomain(object.battery.level));

    this.emit('updateDevice');
  }

  @bind
  handleWaitingMap(): void {
    this.device.updateHasWaitingMap(true);
    this.emit('updateDevice');
  }

  @bind
  handleWorkstatusReport(message: Message<'DEVICE_WORKSTATUS_REPORT_REQ'>): void {
    message.respond('DEVICE_WORKSTATUS_REPORT_RSP', {
      result: 0,
    });
  }

  @bind
  handleReportCleantask(message: Message<'DEVICE_EVENT_REPORT_CLEANTASK'>): void {
    message.respond('UNK_11A4', { unk1: 0 });
  }

  @bind
  handleReportCleanmap(message: Message<'DEVICE_EVENT_REPORT_CLEANMAP'>): void {
    const object = message.packet.payload.object;
    message.respond('DEVICE_EVENT_REPORT_RSP', {
      result: 0,
      body: {
        cleanId: object.cleanId,
      },
    });
  }

  @bind
  handleBinDataReport(message: Message<'DEVICE_CLEANMAP_BINDATA_REPORT_REQ'>): void {
    const object = message.packet.payload.object;
    message.respond('DEVICE_CLEANMAP_BINDATA_REPORT_RSP', {
      result: 0,
      cleanId: object.cleanId,
    });
  }

  @bind
  handleEventReport(message: Message<'DEVICE_EVENT_REPORT_REQ'>): void {
    message.respond('UNK_11A7', { unk1: 0 });
  }

  @bind
  handleSetTime(message: Message<'DEVICE_SETTIME_REQ'>): void {
    const date = new Date();

    message.respond('DEVICE_SETTIME_RSP', {
      deviceTime: Math.floor(date.getTime() / 1000),
      deviceTimezone: -1 * (date.getTimezoneOffset() * 60),
    });
  }

  addConnection(connection: Connection): void {
    const added = this.multiplexer.addConnection(connection);

    if (added && this.multiplexer.connectionCount === 2) {
      void this.handshake();
    }
  }

  handleMessage<Name extends OPDecoderLiteral>(message: Message<Name>): void {
    const handler = this.handlers[message.opname];

    if (message.packet.userId.value !== 0 && message.packet.userId.value !== this.user.id.value) {
      message.respond('COMMON_ERROR_REPLY', {
        result: 11001,
        error: 'Target user is offline',
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

  override toString(): string {
    return [`device: ${this.device.toString()}`, `user: ${this.user.toString()}`].join(' ');
  }

  disconnect(): void {
    this.debug('disconnecting...');

    return this.multiplexer.close();
  }

  send<Name extends OPDecoderLiteral>(opname: Name, object: OPDecoders[Name]): void {
    const ret = this.multiplexer.send({
      opname,
      userId: this.user.id,
      deviceId: this.device.id,
      object,
    });

    if (!ret) {
      throw new DomainException(`There was an error sending opcode '${opname}'`);
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
        reject(new DomainException(`Timeout waiting for response from opcode '${opname}'`));
      };

      const timer = setTimeout(fail, RECV_TIMEOUT);

      this.multiplexer.once(opname, done);
    });
  }

  sendRecv<SendName extends OPDecoderLiteral, RecvName extends OPDecoderLiteral>(
    sendOPName: SendName,
    recvOPName: RecvName,
    sendObject: OPDecoders[SendName],
  ): Promise<Packet<RecvName>> {
    this.send(sendOPName, sendObject);

    return this.recv(recvOPName);
  }
}
