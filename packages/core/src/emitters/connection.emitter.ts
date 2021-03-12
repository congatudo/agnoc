/* eslint-disable @typescript-eslint/unbound-method */
import { TypedEmitter } from "tiny-typed-emitter";
import { OPName } from "../constants/opcodes.constant";
import { bind } from "../decorators/bind.decorator";
import { ArgumentInvalidException } from "../exceptions/argument-invalid.exception";
import { ArgumentNotProvidedException } from "../exceptions/argument-not-provided.exception";
import { DomainException } from "../exceptions/domain.exception";
import { PacketSocket } from "../sockets/packet.socket";
import { ObjectLiteral } from "../types/object-literal.type";
import { isPresent } from "../utils/is-present.util";
import { BigNumber } from "../value-objects/big-number.value-object";
import { ID } from "../value-objects/id.value-object";
import { OPCode } from "../value-objects/opcode.value-object";
import { Packet } from "../value-objects/packet.value-object";
import { Payload } from "../value-objects/payload.value-object";
import { debug } from "../utils/debug.util";
import { Debugger } from "debug";

interface ConnectionSendProps {
  opname: OPName;
  userId: ID;
  deviceId: ID;
  object: unknown;
}

interface ConnectionRespondProps {
  packet: Packet;
  opname: OPName;
  object: unknown;
}

type ConnectionEvents = {
  [key in OPName]: (packet: Packet) => void;
} & {
  data: (packet: Packet) => void;
  close: () => void;
  error: (err: Error) => void;
};

export class Connection extends TypedEmitter<ConnectionEvents> {
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
    this.socket.on("data", this.handlePacket);
    this.socket.on("error", this.handleError);
    this.socket.on("close", this.handleClose);
  }

  send({ opname, userId, deviceId, object }: ConnectionSendProps): boolean {
    const packet = new Packet({
      ctype: 8,
      flow: 0,
      // This swap is intended.
      userId: deviceId,
      deviceId: userId,
      sequence: BigNumber.generate(),
      payload: Payload.fromObject(
        OPCode.fromName(opname),
        object as ObjectLiteral
      ),
    });

    this.debug(`sending packet ${packet.toString()}`);

    return this.socket.write(packet);
  }

  respond({ packet, opname, object }: ConnectionRespondProps): boolean {
    const response = new Packet({
      ctype: packet.ctype,
      flow: packet.flow + 1,
      // This swap is intended.
      userId: packet.deviceId,
      deviceId: packet.userId,
      sequence: packet.sequence,
      payload: Payload.fromObject(
        OPCode.fromName(opname),
        object as ObjectLiteral
      ),
    });

    this.debug(`responding to packet with ${response.toString()}`);

    return this.socket.write(response);
  }

  close(): void {
    this.debug("closing socket...");

    return this.socket.end();
  }

  @bind
  private handlePacket(packet: Packet): void {
    this.validatePacket(packet);

    const opname = packet.payload.opcode.name;

    if (!opname) {
      throw new DomainException(
        `Unable to handle unknown packet ${packet.payload.opcode.toString()}`
      );
    }

    this.debug(`received packet ${packet.toString()}`);
    this.emit(opname, packet);
    this.emit("data", packet);
  }

  @bind
  private handleError(err: Error): void {
    this.emit("error", err);
  }

  @bind
  private handleClose(): void {
    this.emit("close");
  }

  toString(): string {
    return `${this.socket.remoteAddress || "unknown"}:${
      this.socket.remotePort || 0
    }::${this.socket.localAddress || "unknown"}:${this.socket.localPort || 0}`;
  }

  protected validatePacket(packet: Packet): void {
    if (!(packet instanceof Packet)) {
      throw new DomainException("Connection socket emitted non-packet data");
    }
  }

  protected validate(socket: PacketSocket): void {
    if (!isPresent(socket)) {
      throw new ArgumentNotProvidedException(
        "Missing property in connection constructor"
      );
    }

    if (!(socket instanceof PacketSocket)) {
      throw new ArgumentInvalidException(
        "Invalid socket in connection constructor"
      );
    }
  }
}
