import { expect } from 'chai';
import { describe, it } from 'mocha';
import { flipObject } from './flip-object.util';

describe('flip-object.util', () => {
  it('flips object keys', () => {
    const obj = {
      foo: 'bar',
      1: 2,
    };
    const ret = flipObject(obj);

    expect(ret).to.have.property('bar', 'foo');
    expect(ret[2]).to.be.equal('1');
  });
});
