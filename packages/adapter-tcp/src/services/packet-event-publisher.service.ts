import { DomainException } from '@agnoc/toolkit';
import type { PacketEventBus, PacketEventBusEvents } from '../event-buses/packet.event-bus';
import type { PacketMessage } from '../objects/packet.message';
import type { PayloadDataName } from '@agnoc/transport-tcp';

export class PacketEventPublisherService {
  constructor(private readonly packetEventBus: PacketEventBus) {}

  async publishPacketMessage(packetMessage: PacketMessage): Promise<void> {
    const name = packetMessage.packet.payload.opcode.name as PayloadDataName;
    const sequence = packetMessage.packet.sequence.toString();

    this.checkForPacketEventHandler(name);

    // Emit the packet event by the sequence string.
    // This is used to wait for a response from a packet.
    await this.packetEventBus.emit(sequence, packetMessage as PacketEventBusEvents[PayloadDataName]);

    // Emit the packet event by the opcode name.
    await this.packetEventBus.emit(name, packetMessage as PacketEventBusEvents[PayloadDataName]);
  }

  private checkForPacketEventHandler(event: PayloadDataName) {
    const count = this.packetEventBus.listenerCount(event);

    // Throw an error if there is no event handler for the packet event.
    if (count === 0) {
      throw new DomainException(`No event handler found for packet event '${event}'`);
    }
  }
}
