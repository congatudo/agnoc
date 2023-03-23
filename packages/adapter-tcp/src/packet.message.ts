import { DomainException } from '@agnoc/toolkit';
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

  hasPayloadName<Name extends PayloadDataName>(name: Name): this is PacketMessage<Name> {
    return this.packet.payload.opcode.value === (name as string);
  }

  assertPayloadName<Name extends PayloadDataName>(name: Name): asserts this is PacketMessage<Name> {
    if (!this.hasPayloadName(name)) {
      throw new DomainException(
        `Unexpected packet with payload name '${this.packet.payload.opcode.value}', expecting '${name}'`,
      );
    }
  }

  assertDevice(): asserts this is PacketMessage & { device: Device } {
    if (!this.device) {
      throw new DomainException('Connection does not have a reference to a device');
    }
  }
}
