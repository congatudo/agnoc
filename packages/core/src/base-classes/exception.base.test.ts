import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Exceptions } from '../constants/exception.constant';
import { Exception } from './exception.base';

describe('exception.base', () => {
  it('extends from error', () => {
    class E extends Exception {
      name = Exceptions.domain;
    }

    const e = new E('foo');

    expect(e).to.be.instanceof(Error);
  });

  it('has metadata', () => {
    class E extends Exception {
      name = Exceptions.domain;
    }

    const e = new E('foo', { foo: 'bar' });

    expect(e.metadata).to.be.deep.equal({ foo: 'bar' });
  });

  it('can be converted to object', () => {
    class E extends Exception {
      name = Exceptions.domain;
    }

    const e = new E('foo', { foo: 'bar' });

    expect(e.toJSON()).to.be.deep.equal({
      name: Exceptions.domain,
      message: 'foo',
      stack: e.stack,
      metadata: {
        foo: 'bar',
      },
    });
  });
});
