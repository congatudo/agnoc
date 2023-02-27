import { ArgumentOutOfRangeException, ArgumentInvalidException, DomainPrimitive } from '@agnoc/toolkit';
import { OPNAMES, OPCODES } from '../constants/opcodes.constant';
import type { OPCodeLiteral, OPNameLiteral } from '../constants/opcodes.constant';

const MIN_OPCODE = 0;
const MAX_OPCODE = 0xffff;

function toHex(value: number) {
  return `0x${value.toString(16).padStart(4, '0')}`;
}

export class OPCode<Name extends (typeof OPNAMES)[Code], Code extends OPCodeLiteral> extends DomainPrimitive<number> {
  get code(): string {
    return toHex(this.props.value);
  }

  get name(): Name {
    return OPNAMES[this.value as Code] as Name;
  }

  override toString(): string {
    return this.name;
  }

  override toJSON(): Name {
    return this.name;
  }

  protected validate({ value }: DomainPrimitive<number>): void {
    if (value < MIN_OPCODE || value > MAX_OPCODE) {
      throw new ArgumentOutOfRangeException(`Wrong opcode value '${toHex(value)}'`);
    }

    if (!(value in OPNAMES)) {
      throw new ArgumentInvalidException(`Unrecognized opcode value '${toHex(value)}'`);
    }
  }

  static fromCode<Name extends (typeof OPNAMES)[Code], Code extends OPCodeLiteral>(
    code: Code | string,
  ): OPCode<Name, Code> {
    if (typeof code === 'string') {
      code = Number(code) as Code;
    }

    return new OPCode(code);
  }

  static fromName<Name extends (typeof OPNAMES)[Code], Code extends OPCodeLiteral>(
    name: OPNameLiteral,
  ): OPCode<Name, Code> {
    if (!(name in OPCODES)) {
      throw new ArgumentInvalidException(`Invalid opcode with name '${name}'`);
    }

    const code = OPCODES[name] as Code;

    return new OPCode(code);
  }
}
