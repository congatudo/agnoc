import { Connection } from '@agnoc/domain';
import { DomainException, ID } from '@agnoc/toolkit';
import { PacketSocket } from '@agnoc/transport-tcp';
import type { PacketEventBus } from '../event-buses/packet.event-bus';
import type { PacketMessage } from '../objects/packet.message';
import type { ConnectionProps } from '@agnoc/domain';
import type { Packet, PacketFactory, PayloadDataName, PayloadDataFrom, CreatePacketProps } from '@agnoc/transport-tcp';

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

  async send<Name extends PayloadDataName>(name: Name, data: PayloadDataFrom<Name>): Promise<void> {
    this.validateConnectedSocket();

    const packet = this.packetFactory.create(name, data, this.getPacketProps());

    return this.socket.write(packet);
  }

  async respond<Name extends PayloadDataName>(name: Name, data: PayloadDataFrom<Name>, packet: Packet): Promise<void> {
    this.validateConnectedSocket();

    return this.socket.write(this.packetFactory.create(name, data, packet));
  }

  async sendAndWait<Name extends PayloadDataName>(name: Name, data: PayloadDataFrom<Name>): Promise<PacketMessage> {
    this.validateConnectedSocket();

    const packet = this.packetFactory.create(name, data, this.getPacketProps());

    return this.writeAndWait(packet);
  }

  async respondAndWait<Name extends PayloadDataName>(
    name: Name,
    data: PayloadDataFrom<Name>,
    packet: Packet,
  ): Promise<PacketMessage> {
    this.validateConnectedSocket();

    return this.writeAndWait(this.packetFactory.create(name, data, packet));
  }

  async close(): Promise<void> {
    if (!this.socket.connected) {
      return;
    }

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
      this.socket.write(packet).catch(reject);
    });
  }

  private validateConnectedSocket(): void {
    if (!this.socket.connected) {
      throw new DomainException('Unable to send packet through a closed connection');
    }
  }

  static isPacketConnection(connection: Connection): connection is PacketConnection {
    return connection.connectionType === 'PACKET';
  }
}
