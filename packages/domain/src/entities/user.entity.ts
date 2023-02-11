import { ID, Entity } from '@agnoc/toolkit';

export type UserProps = {
  id: ID;
};

export class User extends Entity<UserProps> {}
