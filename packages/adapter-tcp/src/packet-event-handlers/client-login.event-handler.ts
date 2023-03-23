import type { PacketEventHandler } from '../packet.event-handler';
import type { PacketMessage } from '../packet.message';

export class ClientLoginEventHandler implements PacketEventHandler {
  readonly forName = 'CLIENT_ONLINE_REQ';

  async handle(message: PacketMessage<'CLIENT_ONLINE_REQ'>): Promise<void> {
    if (!message.device) {
      const data = {
        result: 12002,
        reason: `Device not registered(devsn: ${message.packet.payload.object.deviceSerialNumber})`,
      };

      return message.respond('CLIENT_ONLINE_RSP', data);
    }

    await message.respond('CLIENT_ONLINE_RSP', { result: 0 });
  }
}
