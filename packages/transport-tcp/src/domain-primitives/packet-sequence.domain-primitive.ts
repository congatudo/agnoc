import { randomBytes } from 'crypto';
import { DomainPrimitive } from '@agnoc/toolkit';

/** Describes the sequence of a packet. */
export class PacketSequence extends DomainPrimitive<bigint> {
  /** Returns the value of the packet sequence as hex string. */
  override toString(): string {
    return this.props.value.toString(16);
  }

  /** Returns the value of the packet sequence as hex string. */
  override toJSON(): string {
    return this.toString();
  }

  protected validate(props: DomainPrimitive<bigint>): void {
    this.validateTypeProp(props, 'value', 'bigint');
  }

  /** Generates a random packet sequence. */
  static generate(): PacketSequence {
    const str = randomBytes(8).toString('hex');
    const value = BigInt(`0x${str}`);

    return new PacketSequence(value);
  }

  /** Creates a packet sequence from a hex string. */
  static fromString(str: string): PacketSequence {
    const value = BigInt(`0x${str}`);

    return new PacketSequence(value);
  }
}
