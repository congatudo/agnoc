/* eslint-disable @typescript-eslint/unbound-method */
import { ValueObject, isPresent, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
import { Connection } from '../emitters/connection.emitter';
import { Packet } from './packet.value-object';
import type { PayloadObjectFrom, PayloadObjectName } from '../constants/payloads.constant';

export interface MessageProps<Name extends PayloadObjectName> {
  connection: Connection;
  packet: Packet<Name>;
}

export type MessageHandler<Name extends PayloadObjectName> = (message: Message<Name>) => void;
export type MessageHandlers = Partial<{
  [Name in PayloadObjectName]: MessageHandler<Name>;
}>;

export class Message<Name extends PayloadObjectName> extends ValueObject<MessageProps<Name>> {
  constructor(props: MessageProps<Name>) {
    super(props);
  }

  get connection(): Connection {
    return this.props.connection;
  }

  get packet(): Packet<Name> {
    return this.props.packet;
  }

  get opname(): Name {
    return this.packet.payload.opcode.name as Name;
  }

  respond<RName extends PayloadObjectName>(opname: RName, object: PayloadObjectFrom<RName>): boolean {
    return this.connection.respond({ packet: this.packet, opname, object });
  }

  public override toString(): string {
    return '[Message]';
  }

  protected validate(props: MessageProps<Name>): void {
    if (![props.connection, props.packet].every(isPresent)) {
      throw new ArgumentNotProvidedException('Missing property in message constructor');
    }

    if (!(props.connection instanceof Connection)) {
      throw new ArgumentInvalidException('Invalid connection in message constructor');
    }

    if (!(props.packet instanceof Packet)) {
      throw new ArgumentInvalidException('Invalid packet in message constructor');
    }

    if (!isPresent(props.packet.payload.opcode.name)) {
      throw new ArgumentInvalidException('Unknown packet in message constructor');
    }
  }
}
