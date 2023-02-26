import { Entity } from '@agnoc/toolkit';
import type { ID } from '@agnoc/toolkit';

export type UserProps = {
  id: ID;
};

export class User extends Entity<UserProps> {}
