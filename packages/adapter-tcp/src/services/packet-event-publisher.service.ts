import { debug } from '@agnoc/toolkit';
import type { PacketEventBus, PacketEventBusEvents } from '../event-buses/packet.event-bus';
import type { PacketMessage } from '../objects/packet.message';
import type { PayloadDataName } from '@agnoc/transport-tcp';

export class PacketEventPublisherService {
  private readonly debug = debug(__filename);

  constructor(private readonly packetEventBus: PacketEventBus) {}

  async publishPacketMessage(packetMessage: PacketMessage): Promise<void> {
    const name = packetMessage.packet.payload.opcode.name as PayloadDataName;
    const sequence = packetMessage.packet.sequence.toString();

    // Emit the packet event by the sequence string.
    // This is used to wait for a response from a packet.
    await this.packetEventBus.emit(sequence, packetMessage as PacketEventBusEvents[PayloadDataName]);

    // Emit the packet event by the opcode name.
    if (this.packetEventBus.listenerCount(name) !== 0) {
      await this.packetEventBus.emit(name, packetMessage as PacketEventBusEvents[PayloadDataName]);
    } else {
      this.debug(`unhandled packet event '${name}': ${packetMessage.packet.toString()}`);
    }
  }
}
