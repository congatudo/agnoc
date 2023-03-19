import { Device } from '@agnoc/domain';
import { ArgumentInvalidException, DomainException, ID } from '@agnoc/toolkit';
import { PacketSocket } from '@agnoc/transport-tcp';
import Emittery from 'emittery';
import type { PacketEventBus } from './packet.event-bus';
import type { PacketMessage } from './packet.message';
import type {
  Packet,
  PacketFactory,
  PayloadObjectName,
  PayloadObjectFrom,
  CreatePacketProps,
} from '@agnoc/transport-tcp';

export interface DeviceConnectionEvents {
  data: Packet;
  close: undefined;
  error: Error;
}

export class DeviceConnection extends Emittery<DeviceConnectionEvents> {
  #device?: Device;

  constructor(
    private readonly packetFactory: PacketFactory,
    private readonly eventBus: PacketEventBus,
    private readonly socket: PacketSocket,
  ) {
    super();
    this.validateSocket();
    this.addListeners();
  }

  get device(): Device | undefined {
    return this.#device;
  }

  set device(device: Device | undefined) {
    if (device && !(device instanceof Device)) {
      throw new ArgumentInvalidException(
        `Value '${device as string} for property 'device' of Connection is not an instance of Device`,
      );
    }

    this.#device = device;
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

  private getPacketProps(): CreatePacketProps {
    return { deviceId: this.#device?.id ?? new ID(0), userId: this.#device?.userId ?? new ID(0) };
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

  private validateSocket() {
    if (!(this.socket instanceof PacketSocket)) {
      throw new DomainException('Socket for Connection is not an instance of PacketSocket');
    }

    if (!this.socket.connected) {
      throw new DomainException('Socket for Connection is closed');
    }
  }

  private addListeners() {
    this.socket.on('data', (packet) => {
      void this.emit('data', packet);
    });
    this.socket.on('error', (err) => {
      void this.emit('error', err);
    });
    this.socket.on('close', () => {
      void this.emit('close');
    });
  }
}
