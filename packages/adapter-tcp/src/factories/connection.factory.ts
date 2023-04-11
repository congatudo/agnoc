import { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { PacketConnectionProps } from '../aggregate-roots/packet-connection.aggregate-root';
import type { PacketEventBus } from '../event-buses/packet.event-bus';
import type { Factory } from '@agnoc/toolkit';
import type { PacketFactory } from '@agnoc/transport-tcp';

export class PacketConnectionFactory implements Factory<PacketConnection> {
  constructor(private readonly packetEventBus: PacketEventBus, private readonly packetFactory: PacketFactory) {}

  create(props: PacketConnectionProps): PacketConnection {
    return new PacketConnection(this.packetFactory, this.packetEventBus, props);
  }
}
