import { DomainPrimitive } from '@agnoc/toolkit';
import type { DomainPrimitiveProps } from 'packages/toolkit/src/base-classes/domain-primitive.base';

/** Describes a clean size value in m<sup>2</sup>. */
export class CleanSize extends DomainPrimitive<number> {
  protected validate(props: DomainPrimitiveProps<number>): void {
    this.validatePositiveIntegerProp(props, 'value');
  }
}
