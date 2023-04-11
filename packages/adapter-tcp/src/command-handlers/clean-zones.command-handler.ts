import { DeviceMode, DeviceModeValue } from '@agnoc/domain';
import { DomainException } from '@agnoc/toolkit';
import { ModeCtrlValue } from '../services/device-mode-changer.service';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { DeviceCleaningService } from '../services/device-cleaning.service';
import type { DeviceMapService } from '../services/device-map.service';
import type { DeviceModeChangerService } from '../services/device-mode-changer.service';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { CommandHandler, CleanZonesCommand, ConnectionWithDevice, Device, DeviceMap } from '@agnoc/domain';

export class CleanZonesCommandHandler implements CommandHandler {
  readonly forName = 'CleanZonesCommand';

  constructor(
    private readonly packetConnectionFinderService: PacketConnectionFinderService,
    private readonly deviceModeChangerService: DeviceModeChangerService,
    private readonly deviceMapService: DeviceMapService,
    private readonly deviceCleaningService: DeviceCleaningService,
  ) {}

  async handle(event: CleanZonesCommand): Promise<void> {
    const connection = await this.packetConnectionFinderService.findByDeviceId(event.deviceId);

    if (!connection) {
      return;
    }

    this.assertDeviceMap(connection);

    await this.deviceModeChangerService.changeMode(connection, new DeviceMode(DeviceModeValue.Zone));
    await this.deviceMapService.setMapZones(connection, event.zones);
    await this.deviceCleaningService.zoneCleaning(connection, ModeCtrlValue.Start);
  }

  assertDeviceMap(
    connection: PacketConnection & ConnectionWithDevice<Device>,
  ): asserts connection is PacketConnection & ConnectionWithDevice<DeviceWithMap> {
    if (!connection.device.map) {
      throw new DomainException('Unable to clean zones without a device with a map');
    }
  }
}

interface DeviceWithMap extends Device {
  map: DeviceMap;
}
