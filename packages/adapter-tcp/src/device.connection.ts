import { Device } from '@agnoc/domain';
import { ArgumentInvalidException, DomainException, ID } from '@agnoc/toolkit';
import { PacketSocket } from '@agnoc/transport-tcp';
import { TypedEmitter } from 'tiny-typed-emitter';
import type { Packet, PacketFactory, PayloadObjectName, PayloadObjectFrom } from '@agnoc/transport-tcp';

export interface DeviceConnectionEvents {
  data: (packet: Packet) => void | Promise<void>;
  close: () => void;
  error: (err: Error) => void;
}

export class DeviceConnection extends TypedEmitter<DeviceConnectionEvents> {
  #device?: Device;

  constructor(private readonly packetFactory: PacketFactory, private readonly socket: PacketSocket) {
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
    const props = { deviceId: this.#device?.id ?? new ID(0), userId: this.#device?.userId ?? new ID(0) };
    const packet = this.packetFactory.create(name, object, props);

    return this.socket.write(packet);
  }

  respond<Name extends PayloadObjectName>(name: Name, object: PayloadObjectFrom<Name>, packet: Packet): Promise<void> {
    return this.socket.write(this.packetFactory.create(name, object, packet));
  }

  close(): Promise<void> {
    return this.socket.end();
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
      this.emit('data', packet);
    });
    this.socket.on('error', (err) => {
      this.emit('error', err);
    });
    this.socket.on('close', () => {
      this.socket.removeAllListeners();
      this.emit('close');
    });
  }
}
