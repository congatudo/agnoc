import { DomainPrimitive } from '@agnoc/toolkit';

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
    this.validateInListProp(props, 'value', Object.values(CleanModeValue));
  }
}
