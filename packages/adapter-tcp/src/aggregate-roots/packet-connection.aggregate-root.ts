import { Connection } from '@agnoc/domain';
import { ID } from '@agnoc/toolkit';
import { PacketSocket } from '@agnoc/transport-tcp';
import type { PacketEventBus } from '../packet.event-bus';
import type { PacketMessage } from '../packet.message';
import type { ConnectionProps } from '@agnoc/domain';
import type {
  Packet,
  PacketFactory,
  PayloadObjectName,
  PayloadObjectFrom,
  CreatePacketProps,
} from '@agnoc/transport-tcp';

export interface PacketConnectionProps extends ConnectionProps {
  socket: PacketSocket;
}

export class PacketConnection extends Connection<PacketConnectionProps> {
  readonly connectionType = 'PACKET';

  constructor(
    private readonly packetFactory: PacketFactory,
    private readonly eventBus: PacketEventBus,
    props: PacketConnectionProps,
  ) {
    super(props);
  }

  get socket(): PacketSocket {
    return this.props.socket;
  }

  send<Name extends PayloadObjectName>(name: Name, object: PayloadObjectFrom<Name>): Promise<void> {
    const packet = this.packetFactory.create(name, object, this.getPacketProps());

    return this.write(packet);
  }

  respond<Name extends PayloadObjectName>(name: Name, object: PayloadObjectFrom<Name>, packet: Packet): Promise<void> {
    return this.write(this.packetFactory.create(name, object, packet));
  }

  sendAndWait<Name extends PayloadObjectName>(name: Name, object: PayloadObjectFrom<Name>): Promise<PacketMessage> {
    const packet = this.packetFactory.create(name, object, this.getPacketProps());

    return this.writeAndWait(packet);
  }

  respondAndWait<Name extends PayloadObjectName>(
    name: Name,
    object: PayloadObjectFrom<Name>,
    packet: Packet,
  ): Promise<PacketMessage> {
    return this.writeAndWait(this.packetFactory.create(name, object, packet));
  }

  close(): Promise<void> {
    return this.socket.end();
  }

  protected override validate(props: PacketConnectionProps): void {
    super.validate(props);

    this.validateDefinedProp(props, 'socket');
    this.validateInstanceProp(props, 'socket', PacketSocket);
  }

  private getPacketProps(): CreatePacketProps {
    return { deviceId: this.device?.id ?? new ID(0), userId: this.device?.userId ?? new ID(0) };
  }

  private writeAndWait(packet: Packet): Promise<PacketMessage> {
    return new Promise((resolve, reject) => {
      this.eventBus.once(packet.sequence.toString()).then(resolve, reject);
      this.write(packet).catch(reject);
    });
  }

  private async write(packet: Packet) {
    if (!this.socket.connected) {
      return;
    }

    return this.socket.write(packet);
  }

  static isPacketConnection(connection: Connection): connection is PacketConnection {
    return connection.connectionType === 'PACKET';
  }
}
