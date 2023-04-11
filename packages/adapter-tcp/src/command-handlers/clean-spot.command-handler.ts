import { DeviceMode, DeviceModeValue, MapPosition } from '@agnoc/domain';
import { ModeCtrlValue } from '../services/device-mode-changer.service';
import type { DeviceCleaningService } from '../services/device-cleaning.service';
import type { DeviceModeChangerService } from '../services/device-mode-changer.service';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { CommandHandler, CleanSpotCommand } from '@agnoc/domain';

export class CleanSpotCommandHandler implements CommandHandler {
  readonly forName = 'CleanSpotCommand';

  constructor(
    private readonly packetConnectionFinderService: PacketConnectionFinderService,
    private readonly deviceModeChangerService: DeviceModeChangerService,
    private readonly deviceCleaningService: DeviceCleaningService,
  ) {}

  async handle(event: CleanSpotCommand): Promise<void> {
    const connection = await this.packetConnectionFinderService.findByDeviceId(event.deviceId);

    if (!connection) {
      return;
    }

    const { x, y } = event.spot;

    await this.deviceModeChangerService.changeMode(connection, new DeviceMode(DeviceModeValue.Spot));
    await this.deviceCleaningService.spotCleaning(connection, new MapPosition({ x, y, phi: 0 }), ModeCtrlValue.Start);
  }
}
