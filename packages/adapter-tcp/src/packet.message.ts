import type { DeviceConnection } from './device.connection';
import type { Device } from '@agnoc/domain';
import type { Packet, PayloadObjectFrom, PayloadObjectName } from '@agnoc/transport-tcp';

export class PacketMessage<Name extends PayloadObjectName> {
  constructor(private readonly connection: DeviceConnection, readonly packet: Packet<Name>) {}

  get device(): Device | undefined {
    return this.connection.device;
  }

  respond<Name extends PayloadObjectName>(name: Name, object: PayloadObjectFrom<Name>): Promise<void> {
    return this.connection.respond(name, object, this.packet);
  }
}
