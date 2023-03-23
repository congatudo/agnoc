import type { PacketConnection } from './aggregate-roots/packet-connection.aggregate-root';
import type { Device } from '@agnoc/domain';
import type { Packet, PayloadDataFrom, PayloadDataName } from '@agnoc/transport-tcp';

export class PacketMessage<Name extends PayloadDataName = PayloadDataName> {
  constructor(readonly connection: PacketConnection, readonly packet: Packet<Name>) {}

  get device(): Device | undefined {
    return this.connection.device;
  }

  respond<Name extends PayloadDataName>(name: Name, object: PayloadDataFrom<Name>): Promise<void> {
    return this.connection.respond(name, object, this.packet);
  }

  respondAndWait<Name extends PayloadDataName>(name: Name, object: PayloadDataFrom<Name>): Promise<PacketMessage> {
    return this.connection.respondAndWait(name, object, this.packet);
  }
}
