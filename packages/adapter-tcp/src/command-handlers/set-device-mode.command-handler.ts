import type { DeviceModeChangerService } from '../services/device-mode-changer.service';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { CommandHandler, SetDeviceModeCommand } from '@agnoc/domain';

export class SetDeviceModeCommandHandler implements CommandHandler {
  readonly forName = 'SetDeviceModeCommand';

  constructor(
    private readonly packetConnectionFinderService: PacketConnectionFinderService,
    private readonly deviceModeChangerService: DeviceModeChangerService,
  ) {}

  async handle(event: SetDeviceModeCommand): Promise<void> {
    const connection = await this.packetConnectionFinderService.findByDeviceId(event.deviceId);

    if (!connection) {
      return;
    }

    await this.deviceModeChangerService.changeMode(connection, event.mode);
  }
}
