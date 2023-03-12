/* eslint-disable @typescript-eslint/unbound-method */
import {
  debug,
  bind,
  DomainException,
  isPresent,
  ArgumentNotProvidedException,
  ArgumentInvalidException,
} from '@agnoc/toolkit';
import { Packet, PacketSocket, PacketSequence, OPCode } from '@agnoc/transport-tcp';
import { TypedEmitter } from 'tiny-typed-emitter';
import type { ID } from '@agnoc/toolkit';
import type { PayloadObjectName, PayloadObjectFrom, PayloadFactory } from '@agnoc/transport-tcp';
import type { Debugger } from 'debug';

export interface ConnectionSendProps<Name extends PayloadObjectName> {
  opname: Name;
  userId: ID;
  deviceId: ID;
  object: PayloadObjectFrom<Name>;
}

export interface ConnectionRespondProps<Name extends PayloadObjectName> {
  packet: Packet;
  opname: Name;
  object: PayloadObjectFrom<Name>;
}

export type ConnectionEvents<Name extends PayloadObjectName> = {
  [key in Name]: (packet: Packet<Name>) => void;
} & {
  data: (packet: Packet<Name>) => void;
  close: () => void;
  error: (err: Error) => void;
};

export class Connection extends TypedEmitter<ConnectionEvents<PayloadObjectName>> {
  private socket: PacketSocket;
  private debug: Debugger;

  constructor(private readonly payloadFactory: PayloadFactory, socket: PacketSocket) {
    super();
    this.validate(socket);
    this.socket = socket;
    this.addListeners();
    this.debug = debug(__filename).extend(this.toString());
    this.debug(`new connection`);
  }

  private addListeners(): void {
    this.socket.on('data', this.handlePacket);
    this.socket.on('error', this.handleError);
    this.socket.on('close', this.handleClose);
  }

  send<Name extends PayloadObjectName>({ opname, userId, deviceId, object }: ConnectionSendProps<Name>): boolean {
    const packet = new Packet({
      ctype: 2,
      flow: 0,
      // This swap is intended.
      userId: deviceId,
      deviceId: userId,
      sequence: PacketSequence.generate(),
      payload: this.payloadFactory.create(OPCode.fromName(opname), object),
    });

    this.debug(`sending packet ${packet.toString()}`);

    return this.write(packet);
  }

  respond<Name extends PayloadObjectName>({ packet, opname, object }: ConnectionRespondProps<Name>): boolean {
    const response = new Packet({
      ctype: packet.ctype,
      flow: packet.flow + 1,
      // This swap is intended.
      userId: packet.deviceId,
      deviceId: packet.userId,
      sequence: packet.sequence,
      payload: this.payloadFactory.create(OPCode.fromName(opname), object),
    });

    this.debug(`responding to packet with ${response.toString()}`);

    return this.write(response);
  }

  private write(packet: Packet): boolean {
    if (!this.socket.destroyed && !this.socket.connecting) {
      return this.socket.write(packet);
    }

    return false;
  }

  close(): void {
    this.debug('closing socket...');
    this.socket.end();
  }

  @bind
  private handlePacket(packet: Packet): void {
    this.validatePacket(packet);

    const opname = packet.payload.opcode.name as PayloadObjectName;

    if (!opname) {
      throw new DomainException(`Unable to handle unknown packet ${packet.payload.opcode.toString()}`);
    }

    this.debug(`received packet ${packet.toString()}`);
    this.emit(opname, packet);
    this.emit('data', packet);
  }

  @bind
  private handleError(err: Error): void {
    this.emit('error', err);
  }

  @bind
  private handleClose(): void {
    this.emit('close');
  }

  override toString(): string {
    return `${this.socket.remoteAddress || 'unknown'}:${this.socket.remotePort || 0}::${
      this.socket.localAddress || 'unknown'
    }:${this.socket.localPort || 0}`;
  }

  protected validatePacket(packet: Packet): void {
    if (!(packet instanceof Packet)) {
      throw new DomainException('Connection socket emitted non-packet data');
    }
  }

  protected validate(socket: PacketSocket): void {
    if (!isPresent(socket)) {
      throw new ArgumentNotProvidedException('Missing property in connection constructor');
    }

    if (!(socket instanceof PacketSocket)) {
      throw new ArgumentInvalidException('Invalid socket in connection constructor');
    }
  }
}
