import { ArgumentInvalidException, DomainPrimitive } from '@agnoc/toolkit';
import type { DomainPrimitiveProps } from 'packages/toolkit/src/base-classes/domain-primitive.base';

/** Describes a clean size value in m<sup>2</sup>. */
export class CleanSize extends DomainPrimitive<number> {
  protected validate({ value }: DomainPrimitiveProps<number>): void {
    if (!Number.isInteger(value) || value < 0) {
      throw new ArgumentInvalidException(`Value '${value}' for ${this.constructor.name} is not a positive integer`);
    }
  }
}
