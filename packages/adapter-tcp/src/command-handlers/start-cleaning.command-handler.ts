import { DeviceCapability, DeviceMode, DeviceModeValue, DeviceStateValue } from '@agnoc/domain';
import { DomainException } from '@agnoc/toolkit';
import { ModeCtrlValue } from '../services/device-mode-changer.service';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { DeviceCleaningService } from '../services/device-cleaning.service';
import type { DeviceMapService } from '../services/device-map.service';
import type { DeviceModeChangerService } from '../services/device-mode-changer.service';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { CommandHandler, StartCleaningCommand, ConnectionWithDevice, Device, DeviceMap } from '@agnoc/domain';

export class StartCleaningCommandHandler implements CommandHandler {
  readonly forName = 'StartCleaningCommand';

  constructor(
    private readonly packetConnectionFinderService: PacketConnectionFinderService,
    private readonly deviceModeChangerService: DeviceModeChangerService,
    private readonly deviceCleaningService: DeviceCleaningService,
    private readonly deviceMapService: DeviceMapService,
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
      return this.deviceCleaningService.zoneCleaning(connection, ModeCtrlValue.Start);
    }

    if (deviceModeValue === DeviceModeValue.Mop) {
      return this.deviceCleaningService.mopCleaning(connection, ModeCtrlValue.Start);
    }

    if (deviceModeValue === DeviceModeValue.Spot) {
      return this.startSpotCleaning(connection);
    }

    if (this.isDockedAndSupportsMapPlansAndHasMap(connection)) {
      await this.deviceMapService.enableWholeClean(connection);
    }

    return this.deviceCleaningService.autoCleaning(connection, ModeCtrlValue.Start);
  }

  private async changeDeviceMode(connection: PacketConnection & ConnectionWithDevice) {
    const deviceModeValue = connection.device.hasMopAttached ? DeviceModeValue.Mop : DeviceModeValue.None;
    const deviceMode = new DeviceMode(deviceModeValue);

    await this.deviceModeChangerService.changeMode(connection, deviceMode);
  }

  private async startSpotCleaning(connection: PacketConnection & ConnectionWithDevice) {
    if (!connection.device.map) {
      throw new DomainException('Unable to start spot cleaning, no map available');
    }

    if (!connection.device.map.currentSpot) {
      throw new DomainException('Unable to start spot cleaning, no spot selected');
    }

    return this.deviceCleaningService.spotCleaning(connection, connection.device.map.currentSpot, ModeCtrlValue.Start);
  }

  private isDockedAndSupportsMapPlansAndHasMap(
    connection: PacketConnection & ConnectionWithDevice,
  ): connection is PacketConnection & ConnectionWithDevice<DeviceWithMap> {
    const supportsMapPlans = connection.device.system.supports(DeviceCapability.MAP_PLANS);
    const deviceStateValue = connection.device.state?.value;
    const hasMap = connection.device.map;

    return Boolean(supportsMapPlans && deviceStateValue === DeviceStateValue.Docked && hasMap);
  }
}

interface DeviceWithMap extends Device {
  map: DeviceMap;
}
