import { randomBytes } from "crypto";
import {
  ValueObject,
  DomainPrimitive,
} from "../base-classes/value-object.base";
import { ArgumentInvalidException } from "../exceptions/argument-invalid.exception";

export type BigNumberSerialized = string;

export class BigNumber extends ValueObject<bigint> {
  constructor(value: bigint) {
    super({ value });
  }

  public get value(): bigint {
    return this.props.value;
  }

  public toString(): string {
    return this.props.value.toString(16);
  }

  public toJSON(): BigNumberSerialized {
    return this.toString();
  }

  protected validate(props: DomainPrimitive<bigint>): void {
    if (typeof props.value !== "bigint") {
      throw new ArgumentInvalidException("Invalid bigint");
    }
  }

  public static generate(): BigNumber {
    const str = randomBytes(8).toString("hex");
    const value = BigInt(`0x${str}`);

    return new BigNumber(value);
  }

  public static fromJSON(str: BigNumberSerialized): BigNumber {
    const value = BigInt(`0x${str}`);

    return new BigNumber(value);
  }

  public static fromString(str: string): BigNumber {
    const value = BigInt(`0x${str}`);

    return new BigNumber(value);
  }
}
