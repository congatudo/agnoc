import { expect } from 'chai';
import { flipObject } from './flip-object.util';

describe('flip-object.util', function () {
  it('flips object keys', function () {
    const obj = {
      foo: 'bar',
      1: 2,
    };
    const ret = flipObject(obj);

    expect(ret).to.have.property('bar', 'foo');
    expect(ret[2]).to.be.equal('1');
  });
});
