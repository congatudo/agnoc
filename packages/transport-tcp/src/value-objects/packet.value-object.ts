import { ValueObject, ID } from '@agnoc/toolkit';
import { PacketSequence } from '../domain-primitives/packet-sequence.domain-primitive';
import { Payload } from './payload.value-object';
import type { PayloadDataName } from '../constants/payloads.constant';

/** Describes the properties of a packet. */
export interface PacketProps<Name extends PayloadDataName> {
  /** The packet type. */
  ctype: number;
  /** The packet flow. */
  flow: number;
  /** The device id. */
  deviceId: ID;
  /** The user id. */
  userId: ID;
  /** The packet sequence. */
  sequence: PacketSequence;
  /** The packet payload. */
  payload: Payload<Name>;
}

/** Describes a packet. */
export class Packet<Name extends PayloadDataName = PayloadDataName> extends ValueObject<PacketProps<Name>> {
  /** Returns the packet type. */
  get ctype(): number {
    return this.props.ctype;
  }

  /** Returns the packet flow. */
  get flow(): number {
    return this.props.flow;
  }

  /** Returns the user id. */
  get userId(): ID {
    return this.props.userId;
  }

  /** Returns the device id. */
  get deviceId(): ID {
    return this.props.deviceId;
  }

  /** Returns the packet sequence. */
  get sequence(): PacketSequence {
    return this.props.sequence;
  }

  /** Returns the packet payload. */
  get payload(): Payload<Name> {
    return this.props.payload;
  }

  override toString(): string {
    return [
      `[${this.props.sequence.toString()}]`,
      `[ctype: ${this.props.ctype}]`,
      `[flow: ${this.props.flow}]`,
      `[userId: ${this.props.userId.toString()}]`,
      `[deviceId: ${this.props.deviceId.toString()}]`,
      this.props.payload.toString(),
    ].join(' ');
  }

  protected validate(props: PacketProps<Name>): void {
    const keys: (keyof PacketProps<Name>)[] = ['ctype', 'flow', 'deviceId', 'userId', 'sequence', 'payload'];

    keys.forEach((prop) => {
      this.validateDefinedProp(props, prop);
    });

    this.validateNumberProp(props, 'ctype');
    this.validateNumberProp(props, 'flow');
    this.validateInstanceProp(props, 'userId', ID);
    this.validateInstanceProp(props, 'deviceId', ID);
    this.validateInstanceProp(props, 'sequence', PacketSequence);
    this.validateInstanceProp(props, 'payload', Payload);
  }
}
