import { DeviceCapability, DeviceMode, DeviceModeValue, DeviceStateValue } from '@agnoc/domain';
import { DomainException } from '@agnoc/toolkit';
import { ModeCtrlValue } from '../services/device-mode-changer.service';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { PacketMessage } from '../objects/packet.message';
import type { DeviceModeChangerService } from '../services/device-mode-changer.service';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { CommandHandler, StartCleaningCommand, ConnectionWithDevice } from '@agnoc/domain';

export class StartCleaningCommandHandler implements CommandHandler {
  readonly forName = 'StartCleaningCommand';

  constructor(
    private readonly packetConnectionFinderService: PacketConnectionFinderService,
    private readonly deviceModeChangerService: DeviceModeChangerService,
  ) {}

  async handle(event: StartCleaningCommand): Promise<void> {
    const connection = await this.packetConnectionFinderService.findByDeviceId(event.deviceId);

    if (!connection) {
      return;
    }

    await this.changeDeviceMode(connection);

    const device = connection.device;
    const deviceModeValue = device.mode?.value;

    if (deviceModeValue === DeviceModeValue.Zone) {
      return this.startZoneCleaning(connection);
    }

    if (deviceModeValue === DeviceModeValue.Mop) {
      return this.startMopCleaning(connection);
    }

    if (deviceModeValue === DeviceModeValue.Spot) {
      return this.startSpotCleaning(connection);
    }

    if (this.isDockedAndSupportsMapPlans(connection)) {
      await this.enableWholeClean(connection);
    }

    return this.startAutoCleaning(connection);
  }

  private async changeDeviceMode(connection: PacketConnection & ConnectionWithDevice) {
    const deviceModeValue = connection.device.hasMopAttached ? DeviceModeValue.Mop : DeviceModeValue.None;
    const deviceMode = new DeviceMode(deviceModeValue);

    await this.deviceModeChangerService.changeMode(connection, deviceMode);
  }

  private async startZoneCleaning(connection: PacketConnection & ConnectionWithDevice) {
    const response: PacketMessage = await connection.sendAndWait('DEVICE_AREA_CLEAN_REQ', {
      ctrlValue: ModeCtrlValue.Start,
    });

    response.assertPayloadName('DEVICE_AREA_CLEAN_RSP');
  }

  private async startSpotCleaning(connection: PacketConnection & ConnectionWithDevice) {
    if (!connection.device.map) {
      throw new DomainException('Unable to start spot cleaning, no map available');
    }

    if (!connection.device.map.currentSpot) {
      throw new DomainException('Unable to start spot cleaning, no spot selected');
    }

    const response: PacketMessage = await connection.sendAndWait('DEVICE_MAPID_SET_NAVIGATION_REQ', {
      mapHeadId: connection.device.map.id.value,
      poseX: connection.device.map.currentSpot.x,
      poseY: connection.device.map.currentSpot.y,
      posePhi: connection.device.map.currentSpot.phi,
      ctrlValue: ModeCtrlValue.Start,
    });

    response.assertPayloadName('DEVICE_MAPID_SET_NAVIGATION_RSP');
  }

  private async startMopCleaning(connection: PacketConnection & ConnectionWithDevice) {
    const response: PacketMessage = await connection.sendAndWait('DEVICE_MOP_FLOOR_CLEAN_REQ', {
      ctrlValue: ModeCtrlValue.Start,
    });

    response.assertPayloadName('DEVICE_MOP_FLOOR_CLEAN_RSP');
  }

  private async startAutoCleaning(connection: PacketConnection & ConnectionWithDevice) {
    const response: PacketMessage = await connection.sendAndWait('DEVICE_AUTO_CLEAN_REQ', {
      ctrlValue: ModeCtrlValue.Start,
      cleanType: 2,
    });

    response.assertPayloadName('DEVICE_AUTO_CLEAN_RSP');
  }

  private isDockedAndSupportsMapPlans(connection: PacketConnection & ConnectionWithDevice) {
    const supportsMapPlans = connection.device.system.supports(DeviceCapability.MAP_PLANS);
    const deviceStateValue = connection.device.state?.value;

    return supportsMapPlans && deviceStateValue === DeviceStateValue.Docked;
  }

  private async enableWholeClean(connection: PacketConnection & ConnectionWithDevice) {
    if (!connection.device.map) {
      return;
    }

    const { id, restrictedZones, rooms } = connection.device.map;
    const response: PacketMessage = await connection.sendAndWait('DEVICE_MAPID_SET_PLAN_PARAMS_REQ', {
      mapHeadId: id.value,
      // FIXME: this will change user map name.
      mapName: 'Default',
      planId: 2,
      // FIXME: this will change user plan name.
      planName: 'Default',
      roomList: rooms.map((room) => ({
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

    response.assertPayloadName('DEVICE_MAPID_SET_PLAN_PARAMS_RSP');
  }
}
