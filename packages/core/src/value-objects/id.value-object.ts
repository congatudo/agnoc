import { randomBytes } from 'crypto';
import { DomainPrimitive, ValueObject } from '../base-classes/value-object.base';
import { ArgumentInvalidException } from '../exceptions/argument-invalid.exception';

export type IDSerialized = number;

export class ID extends ValueObject<number> {
  constructor(value: number) {
    super({ value });
  }

  public get value(): number {
    return this.props.value;
  }

  protected validate({ value }: DomainPrimitive<number>): void {
    if (typeof value !== 'number') {
      throw new ArgumentInvalidException('Incorrect ID value');
    }
  }

  static generate(): ID {
    const uint32 = randomBytes(2).toString('hex');
    const id = parseInt(uint32, 16);

    return new ID(id);
  }

  static fromJSON(value: IDSerialized): ID {
    return new ID(value);
  }
}
