import { ValueObject, ArgumentInvalidException } from '@agnoc/toolkit';
import type { DomainPrimitive } from '@agnoc/toolkit';

/** Describes a clean size value in m<sup>2</sup>. */
export class CleanSize extends ValueObject<number> {
  /** Returns the clean size value in m<sup>2</sup>. */
  get value(): number {
    return this.props.value;
  }

  protected validate(props: DomainPrimitive<number>): void {
    if (!Number.isInteger(props.value) || props.value < 0) {
      throw new ArgumentInvalidException(`Value '${props.value}' for clean size is not a positive integer`);
    }
  }
}
