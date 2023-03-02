import { ArgumentInvalidException, DomainPrimitive } from '@agnoc/toolkit';

/** Describes a clean mode value. */
export enum CleanModeValue {
  Auto = 'Auto',
  Border = 'Border',
  Mop = 'Mop',
}

/**
 * Describes a clean mode.
 *
 * Allowed values from {@link CleanModeValue}.
 */
export class CleanMode extends DomainPrimitive<CleanModeValue> {
  protected validate(props: DomainPrimitive<CleanModeValue>): void {
    if (!Object.values(CleanModeValue).includes(props.value)) {
      throw new ArgumentInvalidException(`Value '${props.value}' for ${this.constructor.name} is invalid`);
    }
  }
}
