import { ArgumentInvalidException, DomainPrimitive } from '@agnoc/toolkit';
import { OPNAMES, OPCODES } from '../constants/opcodes.constant';
import type { OPCodeLiteral, OPNameLiteral, OPCodeFrom } from '../constants/opcodes.constant';

/** Describes an opcode. */
export class OPCode<Code extends OPCodeLiteral> extends DomainPrimitive<Code> {
  /** Returns the hex string representation of the opcode. */
  get code(): string {
    return toHexString(this.props.value);
  }

  /** Returns the name of the opcode. */
  get name(): string {
    return OPNAMES[this.value];
  }

  /** Returns the hex string representation of the opcode. */
  override toString(): string {
    return this.name;
  }

  /** Returns the hex string representation of the opcode. */
  override toJSON(): string {
    return this.name;
  }

  protected validate(props: DomainPrimitive<Code>): void {
    this.validateNumberProp(props, 'value', { min: OPCodeMinValue, max: OPCodeMaxValue });
    this.validateListProp(props, 'value', Object.values(OPCODES) as Code[]);
  }

  /** Creates a new instance of the opcode with the provided code. */
  static fromCode<Code extends OPCodeLiteral>(code: Code | string): OPCode<Code> {
    if (typeof code === 'string') {
      code = Number(code) as Code;
    }

    return new OPCode(code);
  }

  /** Creates a new instance of the opcode with the provided name. */
  static fromName<Name extends OPNameLiteral>(name: Name): OPCode<OPCodeFrom<Name>> {
    if (!(name in OPCODES)) {
      throw new ArgumentInvalidException(`Value '${name}' for property 'name' of ${this.name} is invalid`);
    }

    const code = OPCODES[name] as OPCodeFrom<Name>;

    return new this(code);
  }
}

export const OPCodeMinValue = 0;
export const OPCodeMaxValue = 0xffff;

function toHexString(value: number): string {
  return `0x${value.toString(16).padStart(4, '0')}`;
}
