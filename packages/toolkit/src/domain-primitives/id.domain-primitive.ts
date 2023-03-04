import { randomBytes } from 'crypto';
import { DomainPrimitive } from '../base-classes/domain-primitive.base';
import { ArgumentInvalidException } from '../exceptions/argument-invalid.exception';
import type { DomainPrimitiveProps } from '../base-classes/domain-primitive.base';

export class ID extends DomainPrimitive<number> {
  protected validate({ value }: DomainPrimitiveProps<number>): void {
    if (!Number.isInteger(value) || value < 0) {
      throw new ArgumentInvalidException(`Value '${value}' for id is not a positive integer`);
    }
  }

  static generate(): ID {
    const uint32 = randomBytes(2).toString('hex');
    const id = parseInt(uint32, 16);

    return new ID(id);
  }
}
