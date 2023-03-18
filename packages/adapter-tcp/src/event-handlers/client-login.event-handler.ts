import type { PacketEventHandler, PacketEventHandleParameter } from '../packet.event-handler';

export class ClientLoginEventHandler implements PacketEventHandler {
  eventName = 'CLIENT_ONLINE_REQ' as const;

  async handle(message: PacketEventHandleParameter<this>): Promise<void> {
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
