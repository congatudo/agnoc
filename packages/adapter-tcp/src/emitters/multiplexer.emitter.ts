/* eslint-disable @typescript-eslint/unbound-method */
import { DomainException, debug, bind } from '@agnoc/toolkit';
import { TypedEmitter } from 'tiny-typed-emitter';
import type { Connection } from './connection.emitter';
import type { Device } from '@agnoc/domain';
import type { PayloadObjectName, Packet, PayloadObjectFrom } from '@agnoc/transport-tcp';

export type MultiplexerEvents<Name extends PayloadObjectName> = {
  [key in Name]: (packet: Packet<Name>) => void;
} & {
  data: (packet: Packet) => void;
  error: (err: Error) => void;
};

export interface MultiplexerSendProps<Name extends PayloadObjectName> {
  opname: Name;
  device: Device;
  object: PayloadObjectFrom<Name>;
}

export class Multiplexer extends TypedEmitter<MultiplexerEvents<PayloadObjectName>> {
  private connections: Connection[] = [];
  private debug = debug(__filename);

  get hasConnections(): boolean {
    return this.connections.length > 0;
  }

  get connectionCount(): number {
    return this.connections.length;
  }

  addConnection(connection: Connection): boolean {
    if (!this.connections.includes(connection)) {
      connection.on('data', this.handlePacket);
      connection.on('error', (err) => this.handleError(connection, err));
      connection.on('close', () => this.handleClose(connection));

      this.connections = [...this.connections, connection];
      this.debug('added connection');

      return true;
    }

    return false;
  }

  send(props: MultiplexerSendProps<PayloadObjectName>): Promise<void> {
    const connection = this.connections[0];

    if (!connection) {
      const error = new DomainException(`No valid connection found to send packet ${props.opname}`);

      this.emit('error', error);

      throw error;
    }

    return connection.send(props);
  }

  async close(): Promise<void> {
    this.debug('closing connections...');

    await Promise.all([this.connections.map((connection) => connection.close())]);
  }

  @bind
  private handlePacket(packet: Packet): void {
    const opname = packet.payload.opcode.name as PayloadObjectName;

    if (!opname) {
      throw new DomainException(`Unable to handle unknown packet ${packet.payload.opcode.toString()}`);
    }

    this.emit(opname, packet);
    this.emit('data', packet);
  }

  @bind
  private handleError(connection: Connection, err: Error): void {
    this.emit('error', err);
    this.handleClose(connection);
  }

  @bind
  private handleClose(connection: Connection): void {
    // TODO: fix this.
    // Remove all listeners to prevent mem leaks.
    // But ensure error handling works...
    // connection.removeAllListeners();

    this.connections = this.connections.filter((conn) => conn !== connection);
    this.debug('removed connection');
  }
}
