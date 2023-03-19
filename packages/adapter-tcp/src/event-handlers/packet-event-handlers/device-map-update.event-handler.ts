import {
  DeviceCleanWork,
  CleanSize,
  DeviceTime,
  DeviceMap,
  MapCoordinate,
  MapPixel,
  MapPosition,
  Room,
  Zone,
} from '@agnoc/domain';
import { DomainException, ID, isPresent } from '@agnoc/toolkit';
import type { DeviceBatteryMapper } from '../../mappers/device-battery.mapper';
import type { DeviceErrorMapper } from '../../mappers/device-error.mapper';
import type { DeviceFanSpeedMapper } from '../../mappers/device-fan-speed.mapper';
import type { DeviceModeMapper } from '../../mappers/device-mode.mapper';
import type { DeviceStateMapper } from '../../mappers/device-state.mapper';
import type { PacketEventHandler } from '../../packet.event-handler';
import type { PacketMessage } from '../../packet.message';

export class DeviceMapUpdateEventHandler implements PacketEventHandler {
  readonly eventName = 'DEVICE_MAPID_GET_GLOBAL_INFO_RSP';

  constructor(
    private readonly deviceBatteryMapper: DeviceBatteryMapper,
    private readonly deviceModeMapper: DeviceModeMapper,
    private readonly deviceStateMapper: DeviceStateMapper,
    private readonly deviceErrorMapper: DeviceErrorMapper,
    private readonly deviceFanSpeedMapper: DeviceFanSpeedMapper,
  ) {}

  async handle(message: PacketMessage<'DEVICE_MAPID_GET_GLOBAL_INFO_RSP'>): Promise<void> {
    if (!message.device) {
      throw new DomainException('Device not found');
    }

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
    } = message.packet.payload.object;

    if (statusInfo) {
      const {
        batteryPercent: battery,
        faultType: type,
        workingMode: workMode,
        chargeState: chargeStatus,
        cleanPreference,
        faultCode,
      } = statusInfo;

      message.device.updateCurrentClean(
        new DeviceCleanWork({
          size: new CleanSize(statusInfo.cleanSize),
          time: DeviceTime.fromMinutes(statusInfo.cleanTime),
        }),
      );
      message.device.updateBattery(this.deviceBatteryMapper.toDomain(battery));
      message.device.updateMode(this.deviceModeMapper.toDomain(workMode));
      message.device.updateState(this.deviceStateMapper.toDomain({ type, workMode, chargeStatus }));
      message.device.updateError(this.deviceErrorMapper.toDomain(faultCode));
      message.device.updateFanSpeed(this.deviceFanSpeedMapper.toDomain(cleanPreference));
    }

    let map = message.device.map;

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

      message.device.updateMap(map);
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

    // TODO: save entities and publish domain events
  }
}
