import type { PacketEventHandler } from '../packet.event-handler';
import type { PacketMessage } from '../packet.message';

export class ClientHeartbeatEventHandler implements PacketEventHandler {
  readonly forName = 'CLIENT_HEARTBEAT_REQ';

  async handle(message: PacketMessage<'CLIENT_HEARTBEAT_REQ'>): Promise<void> {
    await message.respond('CLIENT_HEARTBEAT_RSP', {});
  }
}
