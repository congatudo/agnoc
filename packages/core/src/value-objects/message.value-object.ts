/* eslint-disable @typescript-eslint/unbound-method */
import { ValueObject } from "../base-classes/value-object.base";
import { OPName } from "../constants/opcodes.constant";
import { ArgumentInvalidException } from "../exceptions/argument-invalid.exception";
import { ArgumentNotProvidedException } from "../exceptions/argument-not-provided.exception";
import { Connection } from "../emitters/connection.emitter";
import { isPresent } from "../utils/is-present.util";
import { Packet } from "./packet.value-object";

interface MessageProps {
  connection: Connection;
  packet: Packet;
}

export class Message extends ValueObject<MessageProps> {
  constructor(props: MessageProps) {
    super(props);
  }

  get connection(): Connection {
    return this.props.connection;
  }

  get packet(): Packet {
    return this.props.packet;
  }

  get opname(): OPName {
    return this.packet.payload.opcode.name as OPName;
  }

  respond(opname: OPName, object: unknown = {}): boolean {
    return this.connection.respond({ packet: this.packet, opname, object });
  }

  public toString(): string {
    return "[Message]";
  }

  protected validate(props: MessageProps): void {
    if (![props.connection, props.packet].map(isPresent)) {
      throw new ArgumentNotProvidedException(
        "Missing property in message constructor"
      );
    }

    if (!(props.connection instanceof Connection)) {
      throw new ArgumentInvalidException(
        "Invalid connection in message constructor"
      );
    }

    if (!(props.packet instanceof Packet)) {
      throw new ArgumentInvalidException(
        "Invalid packet in message constructor"
      );
    }

    if (!isPresent(props.packet.payload.opcode.name)) {
      throw new ArgumentInvalidException(
        "Unknown packet in message constructor"
      );
    }
  }
}
