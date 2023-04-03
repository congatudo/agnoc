import { DeviceModeValue } from '@agnoc/domain';
import { DomainException } from '@agnoc/toolkit';
import { ModeCtrlValue } from '../services/device-mode-changer.service';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { DeviceCleaningService } from '../services/device-cleaning.service';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { CommandHandler, PauseCleaningCommand, ConnectionWithDevice } from '@agnoc/domain';

export class PauseCleaningCommandHandler implements CommandHandler {
  readonly forName = 'PauseCleaningCommand';

  constructor(
    private readonly packetConnectionFinderService: PacketConnectionFinderService,
    private readonly deviceCleaningService: DeviceCleaningService,
  ) {}

  async handle(event: PauseCleaningCommand): Promise<void> {
    const connection = await this.packetConnectionFinderService.findByDeviceId(event.deviceId);

    if (!connection) {
      return;
    }

    const device = connection.device;
    const deviceModeValue = device.mode?.value;

    if (deviceModeValue === DeviceModeValue.Zone) {
      return this.deviceCleaningService.zoneCleaning(connection, ModeCtrlValue.Pause);
    }

    if (deviceModeValue === DeviceModeValue.Mop) {
      return this.deviceCleaningService.mopCleaning(connection, ModeCtrlValue.Pause);
    }

    if (deviceModeValue === DeviceModeValue.Spot) {
      return this.pauseSpotCleaning(connection);
    }

    return this.deviceCleaningService.autoCleaning(connection, ModeCtrlValue.Pause);
  }

  private async pauseSpotCleaning(connection: PacketConnection & ConnectionWithDevice) {
    if (!connection.device.map) {
      throw new DomainException('Unable to pause spot cleaning, no map available');
    }

    if (!connection.device.map.currentSpot) {
      throw new DomainException('Unable to pause spot cleaning, no spot selected');
    }

    await this.deviceCleaningService.spotCleaning(connection, connection.device.map.currentSpot, ModeCtrlValue.Pause);
  }
}
