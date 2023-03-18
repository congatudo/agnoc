import type { PacketEventHandler, PacketEventHandleParameter } from '../packet.event-handler';

export class ClientHeartbeatEventHandler implements PacketEventHandler {
  eventName = 'CLIENT_HEARTBEAT_REQ' as const;

  async handle(message: PacketEventHandleParameter<this>): Promise<void> {
    await message.respond('CLIENT_HEARTBEAT_RSP', {});
  }
}
