/* eslint-disable @typescript-eslint/unbound-method */
import { TypedEmitter } from "tiny-typed-emitter";
import { OPDecoderLiteral, OPDecoders } from "../constants/opcodes.constant";
import { bind } from "../decorators/bind.decorator";
import { DomainException } from "../exceptions/domain.exception";
import { debug } from "../utils/debug.util";
import { ID } from "../value-objects/id.value-object";
import { Packet } from "../value-objects/packet.value-object";
import { Connection } from "./connection.emitter";

type MultiplexerEvents<Name extends OPDecoderLiteral> = {
  [key in Name]: (packet: Packet<Name>) => void;
} & {
  data: (packet: Packet<OPDecoderLiteral>) => void;
  error: (err: Error) => void;
};

interface MultiplexerSendProps<Name extends OPDecoderLiteral> {
  opname: Name;
  userId: ID;
  deviceId: ID;
  object: OPDecoders[Name];
}

export class Multiplexer extends TypedEmitter<
  MultiplexerEvents<OPDecoderLiteral>
> {
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
      connection.on("data", this.handlePacket);
      connection.on("error", (err) => this.handleError(connection, err));
      connection.on("close", () => this.handleClose(connection));

      this.connections = [...this.connections, connection];
      this.debug("added connection");

      return true;
    }

    return false;
  }

  send(props: MultiplexerSendProps<OPDecoderLiteral>): boolean {
    const connection = this.connections[0];

    if (!connection) {
      this.emit(
        "error",
        new DomainException(
          `No valid connection found to send packet ${props.opname}`
        )
      );

      return false;
    }

    return connection.send(props);
  }

  close(): void {
    this.debug("closing connections...");
    this.connections.forEach((connection) => {
      connection.close();
    });
  }

  @bind
  private handlePacket(packet: Packet<OPDecoderLiteral>): void {
    const opname = packet.payload.opcode.name;

    if (!opname) {
      throw new DomainException(
        `Unable to handle unknown packet ${packet.payload.opcode.toString()}`
      );
    }

    this.emit(opname, packet);
    this.emit("data", packet);
  }

  @bind
  private handleError(connection: Connection, err: Error): void {
    this.emit("error", err);
    this.handleClose(connection);
  }

  @bind
  private handleClose(connection: Connection): void {
    // TODO: fix this.
    // Remove all listeners to prevent mem leaks.
    // But ensure error handling works...
    // connection.removeAllListeners();

    this.connections = this.connections.filter((conn) => conn !== connection);
    this.debug("removed connection");
  }
}
