import type { PacketMessage } from '../objects/packet.message';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { CommandHandler, LocateDeviceCommand } from '@agnoc/domain';

export class LocateDeviceCommandHandler implements CommandHandler {
  readonly forName = 'LocateDeviceCommand';

  constructor(private readonly packetConnectionFinderService: PacketConnectionFinderService) {}

  async handle(event: LocateDeviceCommand): Promise<void> {
    const connection = await this.packetConnectionFinderService.findByDeviceId(event.deviceId);

    if (!connection) {
      return;
    }

    const response: PacketMessage = await connection.sendAndWait('DEVICE_SEEK_LOCATION_REQ', {});

    response.assertPayloadName('DEVICE_SEEK_LOCATION_RSP');
  }
}
