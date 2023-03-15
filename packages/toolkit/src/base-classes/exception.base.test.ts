import { expect } from 'chai';
import { Exception } from './exception.base';

describe('exception.base', function () {
  it('extends from error', function () {
    class DummyException extends Exception {}

    const dummyException = new DummyException('foo');

    expect(dummyException).to.be.instanceof(Error);
  });

  it('has metadata', function () {
    class DummyException extends Exception {}

    const dummyException = new DummyException('foo', { foo: 'bar' });

    expect(dummyException.metadata).to.be.deep.equal({ foo: 'bar' });
  });

  it('can be converted to object', function () {
    class DummyException extends Exception {}

    const dummyException = new DummyException('foo');

    expect(dummyException.toJSON()).to.be.deep.equal({
      name: 'DummyException',
      message: 'foo',
      stack: dummyException.stack,
    });
  });

  it('can be converted to object with metadata', function () {
    class DummyException extends Exception {}

    const dummyException = new DummyException('foo', { foo: 'bar' });

    expect(dummyException.toJSON()).to.be.deep.equal({
      name: 'DummyException',
      message: 'foo',
      stack: dummyException.stack,
      metadata: {
        foo: 'bar',
      },
    });
  });

  it('can be converted to object with an exception as cause', function () {
    class DummyException extends Exception {}

    const causeDummyException = new DummyException('bar', { bar: 'baz' });
    const dummyException = new DummyException('foo', { foo: 'bar' }, { cause: causeDummyException });

    expect(dummyException.toJSON()).to.be.deep.equal({
      name: 'DummyException',
      message: 'foo',
      stack: dummyException.stack,
      metadata: { foo: 'bar' },
      cause: {
        name: 'DummyException',
        message: 'bar',
        stack: causeDummyException.stack,
        metadata: { bar: 'baz' },
      },
    });
  });

  it('can be converted to object with an error as cause', function () {
    class DummyException extends Exception {}

    const causeError = new Error('bar');
    const dummyException = new DummyException('foo', { foo: 'bar' }, { cause: causeError });

    expect(dummyException.toJSON()).to.be.deep.equal({
      name: 'DummyException',
      message: 'foo',
      stack: dummyException.stack,
      metadata: { foo: 'bar' },
      cause: {
        name: 'Error',
        message: 'bar',
        stack: causeError.stack,
      },
    });
  });

  it('can be converted to object with not an error as cause', function () {
    class DummyException extends Exception {}

    const causeNotAnError = 'not an error';
    const dummyException = new DummyException('foo', { foo: 'bar' }, { cause: causeNotAnError });

    expect(dummyException.toJSON()).to.be.deep.equal({
      name: 'DummyException',
      message: 'foo',
      stack: dummyException.stack,
      metadata: { foo: 'bar' },
      cause: 'not an error',
    });
  });

  it('can be converted to object with a nested error as cause', function () {
    class DummyException extends Exception {}

    const causeNestedError = new Error('nested');
    const causeError = new Error('bar', { cause: causeNestedError });
    const dummyException = new DummyException('foo', { foo: 'bar' }, { cause: causeError });

    expect(dummyException.toJSON()).to.be.deep.equal({
      name: 'DummyException',
      message: 'foo',
      stack: dummyException.stack,
      metadata: { foo: 'bar' },
      cause: {
        name: 'Error',
        message: 'bar',
        stack: causeError.stack,
        cause: {
          name: 'Error',
          message: 'nested',
          stack: causeNestedError.stack,
        },
      },
    });
  });
});
