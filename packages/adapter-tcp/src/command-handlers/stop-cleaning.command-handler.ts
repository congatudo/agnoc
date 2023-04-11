import { ModeCtrlValue } from '../services/device-mode-changer.service';
import type { DeviceCleaningService } from '../services/device-cleaning.service';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { CommandHandler, StopCleaningCommand } from '@agnoc/domain';

export class StopCleaningCommandHandler implements CommandHandler {
  readonly forName = 'StopCleaningCommand';

  constructor(
    private readonly packetConnectionFinderService: PacketConnectionFinderService,
    private readonly deviceCleaningService: DeviceCleaningService,
  ) {}

  async handle(event: StopCleaningCommand): Promise<void> {
    const connection = await this.packetConnectionFinderService.findByDeviceId(event.deviceId);

    if (!connection) {
      return;
    }

    return this.deviceCleaningService.autoCleaning(connection, ModeCtrlValue.Stop);
  }
}
