/* eslint-disable @typescript-eslint/unbound-method */
import { BigNumber } from '@agnoc/domain';
import {
  debug,
  bind,
  DomainException,
  isPresent,
  ArgumentNotProvidedException,
  ArgumentInvalidException,
} from '@agnoc/toolkit';
import { TypedEmitter } from 'tiny-typed-emitter';
import { PacketSocket } from '../sockets/packet.socket';
import { OPCode } from '../value-objects/opcode.value-object';
import { Packet } from '../value-objects/packet.value-object';
import { Payload } from '../value-objects/payload.value-object';
import type { OPCodeLiteral, OPDecoderLiteral, OPDecoders } from '../constants/opcodes.constant';
import type { ID } from '@agnoc/toolkit';
import type { Debugger } from 'debug';

export interface ConnectionSendProps<Name extends OPDecoderLiteral> {
  opname: Name;
  userId: ID;
  deviceId: ID;
  object: OPDecoders[Name];
}

export interface ConnectionRespondProps<Name extends OPDecoderLiteral> {
  packet: Packet<OPDecoderLiteral>;
  opname: Name;
  object: OPDecoders[Name];
}

export type ConnectionEvents<Name extends OPDecoderLiteral> = {
  [key in Name]: (packet: Packet<Name>) => void;
} & {
  data: (packet: Packet<OPDecoderLiteral>) => void;
  close: () => void;
  error: (err: Error) => void;
};

export class Connection extends TypedEmitter<ConnectionEvents<OPDecoderLiteral>> {
  private socket: PacketSocket;
  private debug: Debugger;

  constructor(socket: PacketSocket) {
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

  send<Name extends OPDecoderLiteral>({ opname, userId, deviceId, object }: ConnectionSendProps<Name>): boolean {
    const packet = new Packet({
      ctype: 2,
      flow: 0,
      // This swap is intended.
      userId: deviceId,
      deviceId: userId,
      sequence: BigNumber.generate(),
      payload: Payload.fromObject(OPCode.fromName<Name, OPCodeLiteral>(opname), object),
    });

    this.debug(`sending packet ${packet.toString()}`);

    return this.write(packet);
  }

  respond<Name extends OPDecoderLiteral>({ packet, opname, object }: ConnectionRespondProps<Name>): boolean {
    const response = new Packet({
      ctype: packet.ctype,
      flow: packet.flow + 1,
      // This swap is intended.
      userId: packet.deviceId,
      deviceId: packet.userId,
      sequence: packet.sequence,
      payload: Payload.fromObject(OPCode.fromName<Name, OPCodeLiteral>(opname), object),
    });

    this.debug(`responding to packet with ${response.toString()}`);

    return this.write(response);
  }

  private write(packet: Packet<OPDecoderLiteral>): boolean {
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
  private handlePacket(packet: Packet<OPDecoderLiteral>): void {
    this.validatePacket(packet);

    const opname = packet.payload.opcode.name;

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

  protected validatePacket(packet: Packet<OPDecoderLiteral>): void {
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
