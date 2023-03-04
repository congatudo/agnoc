import { randomBytes } from 'crypto';
import { ArgumentInvalidException, DomainPrimitive } from '@agnoc/toolkit';

export class BigNumber extends DomainPrimitive<bigint> {
  public override toString(): string {
    return this.props.value.toString(16);
  }

  public override toJSON(): string {
    return this.toString();
  }

  protected validate(props: DomainPrimitive<bigint>): void {
    if (typeof props.value !== 'bigint') {
      throw new ArgumentInvalidException('Invalid bigint');
    }
  }

  public static generate(): BigNumber {
    const str = randomBytes(8).toString('hex');
    const value = BigInt(`0x${str}`);

    return new BigNumber(value);
  }

  public static fromString(str: string): BigNumber {
    const value = BigInt(`0x${str}`);

    return new BigNumber(value);
  }
}
