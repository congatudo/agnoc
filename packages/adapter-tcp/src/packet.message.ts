import type { DeviceConnection } from './device.connection';
import type { Device } from '@agnoc/domain';
import type { Packet, PayloadObjectFrom, PayloadObjectName } from '@agnoc/transport-tcp';

export class PacketMessage<Name extends PayloadObjectName = PayloadObjectName> {
  constructor(readonly connection: DeviceConnection, readonly packet: Packet<Name>) {}

  get device(): Device | undefined {
    return this.connection.device;
  }

  respond<Name extends PayloadObjectName>(name: Name, object: PayloadObjectFrom<Name>): Promise<void> {
    return this.connection.respond(name, object, this.packet);
  }

  respondAndWait<Name extends PayloadObjectName>(name: Name, object: PayloadObjectFrom<Name>): Promise<PacketMessage> {
    return this.connection.respondAndWait(name, object, this.packet);
  }
}
