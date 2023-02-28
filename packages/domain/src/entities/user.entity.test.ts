import { Entity, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { User } from './user.entity';

describe('User', function () {
  let id: ID;

  beforeEach(function () {
    id = new ID(1);
  });

  it('should be created', function () {
    const user = new User({ id });

    expect(user).to.be.instanceOf(Entity);
    expect(user.id).to.be.equal(id);
  });
});
