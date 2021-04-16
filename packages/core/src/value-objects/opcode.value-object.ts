import {
  DomainPrimitive,
  ValueObject,
} from "../base-classes/value-object.base";
import {
  OPNameLiteral,
  OPNAMES,
  OPCODES,
  OPCodeLiteral,
} from "../constants/opcodes.constant";
import { ArgumentInvalidException } from "../exceptions/argument-invalid.exception";
import { ArgumentOutOfRangeException } from "../exceptions/argument-out-of-range.exception";

const MIN_OPCODE = 0;
const MAX_OPCODE = 0xffff;

export class OPCode<
  Name extends typeof OPNAMES[Code],
  Code extends OPCodeLiteral
> extends ValueObject<number> {
  constructor(value: Code) {
    super({ value });
  }

  get value(): Code {
    return this.props.value as Code;
  }

  get code(): string {
    return `0x${this.value.toString(16).padStart(4, "0")}`;
  }

  get name(): Name {
    return OPNAMES[this.value] as Name;
  }

  toString(): string {
    return this.name;
  }

  toJSON(): Name {
    return this.name;
  }

  protected validate({ value }: DomainPrimitive<number>): void {
    if (value < MIN_OPCODE || value > MAX_OPCODE) {
      throw new ArgumentOutOfRangeException(`Wrong opcode value '${value}'`);
    }

    if (!(value in OPNAMES)) {
      throw new ArgumentInvalidException(
        `Unrecognized opcode value '${value}'`
      );
    }
  }

  static fromCode<
    Name extends typeof OPNAMES[Code],
    Code extends OPCodeLiteral
  >(code: Code | string): OPCode<Name, Code> {
    if (typeof code === "string") {
      code = Number(code) as Code;
    }

    return new OPCode(code);
  }

  static fromName<
    Name extends typeof OPNAMES[Code],
    Code extends OPCodeLiteral
  >(name: OPNameLiteral): OPCode<Name, Code> {
    if (!(name in OPCODES)) {
      throw new ArgumentInvalidException(`Invalid opcode with name '${name}'`);
    }

    // eslint-disable-next-line security/detect-object-injection
    const code = OPCODES[name] as Code;

    return new OPCode(code);
  }
}
