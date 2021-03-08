import {
  DomainPrimitive,
  ValueObject,
} from "../base-classes/value-object.base-class";
import { OPName, OPNAMES, OPCODES } from "../constants/opcodes.constant";
import { ArgumentInvalidException } from "../exceptions/argument-invalid.exception";
import { ArgumentOutOfRangeException } from "../exceptions/argument-out-of-range.exception";
import { hasKey } from "../utils/has-key.util";

const MIN_OPCODE = 0;
const MAX_OPCODE = 0xffff;

export interface OPCodeSerialized {
  code: string;
  name: OPName | undefined;
}

export class OPCode extends ValueObject<number> {
  constructor(value: number) {
    super({ value });
  }

  public get value(): number {
    return this.props.value;
  }

  public get code(): string {
    return `0x${this.value.toString(16)}`;
  }

  public get name(): OPName | undefined {
    return OPNAMES[this.value];
  }

  public toString(): string {
    return this.name || this.code;
  }

  public toJSON(): OPCodeSerialized {
    return {
      code: this.code,
      name: this.name,
    };
  }

  public static fromJSON(obj: OPCodeSerialized): OPCode {
    return obj.name ? this.fromName(obj.name) : this.fromCode(obj.code);
  }

  protected validate({ value }: DomainPrimitive<number>): void {
    if (value < MIN_OPCODE || value > MAX_OPCODE) {
      throw new ArgumentOutOfRangeException(`Wrong opcode value '${value}'`);
    }
  }

  public static fromCode(code: number | string): OPCode {
    if (typeof code === "string") {
      code = Number(code);
    }

    return new OPCode(code);
  }

  public static fromName(name: OPName): OPCode {
    if (!hasKey(OPCODES, name)) {
      throw new ArgumentInvalidException(`Invalid opcode with name '${name}'`);
    }

    // eslint-disable-next-line security/detect-object-injection
    const code = OPCODES[name];

    return new OPCode(code);
  }
}
