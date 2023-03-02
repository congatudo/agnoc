import { Entity } from '@agnoc/toolkit';
import { expect } from 'chai';
import { givenSomeUserProps } from '../test-support';
import { User } from './user.entity';

describe('User', function () {
  it('should be created', function () {
    const userProps = givenSomeUserProps();
    const user = new User(userProps);

    expect(user).to.be.instanceOf(Entity);
    expect(user.id).to.be.equal(userProps.id);
  });
});
