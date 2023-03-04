import { isObject, ValueObject } from '@agnoc/toolkit';
import { OPCode } from '../domain-primitives/opcode.domain-primitive';
import type { OPCodeFrom } from '../constants/opcodes.constant';
import type { PayloadObjectFrom, PayloadObjectName } from '../constants/payloads.constant';

/** Describes the properties of a payload. */
export interface PayloadProps<Name extends PayloadObjectName> {
  /** The opcode of the payload. */
  opcode: OPCode<OPCodeFrom<Name>>;
  /** The buffer representation of the payload. */
  buffer: Buffer;
  /** The object representation of the payload. */
  object: PayloadObjectFrom<Name>;
}

/** Describes the JSON representation of a payload. */
export interface JSONPayload<Name extends PayloadObjectName> {
  /** The name of the opcode for the payload. */
  opcode: Name;
  /** The object representation of the payload. */
  object: PayloadObjectFrom<Name>;
}

/** Describes a payload. */
export class Payload<Name extends PayloadObjectName> extends ValueObject<PayloadProps<Name>> {
  /** Returns the opcode of the payload. */
  get opcode(): OPCode<OPCodeFrom<Name>> {
    return this.props.opcode;
  }

  /** Returns the buffer representation of the payload. */
  get buffer(): Buffer {
    return this.props.buffer;
  }

  /** Returns the object representation of the payload. */
  get object(): PayloadObjectFrom<Name> {
    return this.props.object;
  }

  /** Returns the string representation of the payload with some properties filtered. */
  override toString(): string {
    return JSON.stringify(this, filterProperties);
  }

  /** Returns the JSON representation of the payload. */
  override toJSON(): JSONPayload<Name> {
    return { opcode: this.props.opcode.name as Name, object: this.props.object };
  }

  protected validate(props: PayloadProps<Name>): void {
    const keys: (keyof PayloadProps<Name>)[] = ['opcode', 'buffer', 'object'];

    keys.forEach((prop) => {
      this.validateDefinedProp(props, prop);
    });

    this.validateInstanceProp(props, 'opcode', OPCode);
    this.validateInstanceProp(props, 'buffer', Buffer);
    this.validateInstanceProp(props, 'object', Object);
  }
}

function filterProperties(_: string, value: unknown) {
  if (isObject(value) && value.type === 'Buffer') {
    return '[Buffer]';
  }

  return value;
}
