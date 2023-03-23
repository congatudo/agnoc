import { isObject, ValueObject } from '@agnoc/toolkit';
import { OPCode } from '../domain-primitives/opcode.domain-primitive';
import type { PayloadDataFrom, PayloadDataName } from '../constants/payloads.constant';

/** Describes the properties of a payload. */
export interface PayloadProps<Name extends PayloadDataName> {
  /** The opcode of the payload. */
  opcode: OPCode<Name>;
  /** The object representation of the payload. */
  data: PayloadDataFrom<Name>;
}

/** Describes the JSON representation of a payload. */
export interface JSONPayload<Name extends PayloadDataName> {
  /** The name of the opcode for the payload. */
  opcode: Name;
  /** The object representation of the payload. */
  data: PayloadDataFrom<Name>;
}

/** Describes a payload. */
export class Payload<Name extends PayloadDataName = PayloadDataName> extends ValueObject<PayloadProps<Name>> {
  /** Returns the opcode of the payload. */
  get opcode(): OPCode<Name> {
    return this.props.opcode;
  }

  /** Returns the object representation of the payload. */
  get data(): PayloadDataFrom<Name> {
    return this.props.data;
  }

  /** Returns the string representation of the payload with some properties filtered. */
  override toString(): string {
    return JSON.stringify(this, filterProperties);
  }

  /** Returns the JSON representation of the payload. */
  override toJSON(): JSONPayload<Name> {
    return { opcode: this.props.opcode.name as Name, data: this.props.data };
  }

  protected validate(props: PayloadProps<Name>): void {
    const keys: (keyof PayloadProps<Name>)[] = ['opcode', 'data'];

    keys.forEach((prop) => {
      this.validateDefinedProp(props, prop);
    });

    this.validateInstanceProp(props, 'opcode', OPCode);
    this.validateInstanceProp(props, 'data', Object);
  }
}

function filterProperties(_: string, value: unknown) {
  if (isObject(value) && value.type === 'Buffer') {
    return '[Buffer]';
  }

  return value;
}
