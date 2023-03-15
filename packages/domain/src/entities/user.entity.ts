import { Entity } from '@agnoc/toolkit';
import type { EntityProps } from '@agnoc/toolkit';

/** Describes the user properties. */
export type UserProps = EntityProps;

/** Describes a user. */
export class User extends Entity<UserProps> {
  protected validate(_: EntityProps): void {
    // noop
  }
}
