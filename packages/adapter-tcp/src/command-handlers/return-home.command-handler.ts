import type { PacketMessage } from '../objects/packet.message';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { CommandHandler, ReturnHomeCommand } from '@agnoc/domain';

export class ReturnHomeCommandHandler implements CommandHandler {
  readonly forName = 'ReturnHomeCommand';

  constructor(private readonly packetConnectionFinderService: PacketConnectionFinderService) {}

  async handle(event: ReturnHomeCommand): Promise<void> {
    const connection = await this.packetConnectionFinderService.findByDeviceId(event.deviceId);

    if (!connection) {
      return;
    }

    const response: PacketMessage = await connection.sendAndWait('DEVICE_CHARGE_REQ', {
      enable: 1,
    });

    response.assertPayloadName('DEVICE_CHARGE_RSP');
  }
}
