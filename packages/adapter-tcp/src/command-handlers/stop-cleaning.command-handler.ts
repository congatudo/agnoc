import { ModeCtrlValue } from '../services/device-mode-changer.service';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { PacketMessage } from '../objects/packet.message';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { CommandHandler, StopCleaningCommand, ConnectionWithDevice } from '@agnoc/domain';

export class StopCleaningCommandHandler implements CommandHandler {
  readonly forName = 'StopCleaningCommand';

  constructor(private readonly packetConnectionFinderService: PacketConnectionFinderService) {}

  async handle(event: StopCleaningCommand): Promise<void> {
    const connection = await this.packetConnectionFinderService.findByDeviceId(event.deviceId);

    if (!connection) {
      return;
    }

    return this.stopAutoCleaning(connection);
  }

  private async stopAutoCleaning(connection: PacketConnection & ConnectionWithDevice) {
    const response: PacketMessage = await connection.sendAndWait('DEVICE_AUTO_CLEAN_REQ', {
      ctrlValue: ModeCtrlValue.Stop,
      cleanType: 2,
    });

    response.assertPayloadName('DEVICE_AUTO_CLEAN_RSP');
  }
}
