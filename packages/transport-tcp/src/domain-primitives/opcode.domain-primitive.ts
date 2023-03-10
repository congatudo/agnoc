import { ArgumentInvalidException, DomainPrimitive } from '@agnoc/toolkit';
import { OPNAMES, OPCODES } from '../constants/opcodes.constant';
import type { OPCodeLiteral, OPNameLiteral } from '../constants/opcodes.constant';

/** Describes an opcode. */
export class OPCode<Name extends OPNameLiteral> extends DomainPrimitive<Name> {
  /** Returns the code of the opcode. */
  get code(): number {
    return OPCODES[this.value];
  }

  /** Returns the name of the opcode. */
  get name(): string {
    return this.value;
  }

  /** Returns the hex string representation of the opcode. */
  override toString(): string {
    return this.name;
  }

  /** Returns the hex string representation of the opcode. */
  override toJSON(): string {
    return this.name;
  }

  protected validate(props: DomainPrimitive<Name>): void {
    this.validateListProp(props, 'value', Object.values(OPNAMES) as Name[]);
  }

  /** Creates a new instance of the opcode with the provided code. */
  static fromCode<Name extends OPNameLiteral>(code: number | string): OPCode<Name> {
    if (typeof code === 'string') {
      code = Number(code);
    }

    if (!(code in OPNAMES)) {
      throw new ArgumentInvalidException(`Value '${code}' for property 'code' of ${this.name} is invalid`);
    }

    const name = OPNAMES[code as OPCodeLiteral];

    return new this(name) as OPCode<Name>;
  }

  /** Creates a new instance of the opcode with the provided name. */
  static fromName<Name extends OPNameLiteral>(name: Name): OPCode<Name> {
    return new this(name);
  }
}
