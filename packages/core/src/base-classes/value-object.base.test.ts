import { expect } from 'chai';
import { describe, it } from 'mocha';
import sinon from 'sinon';
import { ArgumentNotProvidedException } from '../exceptions/argument-not-provided.exception';
import { ValueObject, DomainPrimitive } from './value-object.base';

describe('value-object.base', () => {
  it('throws an error when has no props', () => {
    class A extends ValueObject<void> {
      protected validate(): void {
        return;
      }
    }

    expect(() => new A()).to.throws(ArgumentNotProvidedException);
  });

  it('validates instances', () => {
    class A extends ValueObject<string> {
      protected validate(): void {
        return;
      }
    }

    const a = new A({ value: 'foo' });

    expect(ValueObject.isValueObject(a)).to.be.true;
  });

  describe('as primitive', () => {
    it('validates its own props', () => {
      const spy = sinon.spy();

      class A extends ValueObject<string> {
        protected validate(props: DomainPrimitive<string>): void {
          spy(props);
        }
      }

      new A({ value: 'foo' });

      expect(spy).to.have.been.calledWith({ value: 'foo' });
    });

    it('has structural equality', () => {
      class A extends ValueObject<string> {
        protected validate(): void {
          return;
        }
      }

      class B extends ValueObject<string> {
        protected validate(): void {
          return;
        }
      }

      const a = new A({ value: 'foo' });
      const b = new B({ value: 'foo' });

      expect(a.equals(b)).to.be.true;
    });

    it('is not equal to null', () => {
      class A extends ValueObject<string> {
        protected validate(): void {
          return;
        }
      }

      const a = new A({ value: 'foo' });

      expect(a.equals(null)).to.be.false;
    });

    it('can be converted to string', () => {
      class A extends ValueObject<string> {
        protected validate(): void {
          return;
        }
      }

      const a = new A({ value: 'foo' });

      expect(a.toString()).to.be.equal('foo');
    });

    it('can be converted to object', () => {
      class A extends ValueObject<string> {
        protected validate(): void {
          return;
        }
      }

      const a = new A({ value: 'foo' });

      expect(a.toJSON()).to.be.deep.equal('foo');
    });

    it('clones itself', () => {
      class A extends ValueObject<string> {
        protected validate(): void {
          return;
        }
      }

      const a = new A({ value: 'foo' });
      const b = a.clone({ value: 'bar' });

      expect(b.toJSON()).to.be.deep.equal('bar');
      expect(b).to.be.instanceof(A);
    });
  });

  describe('as object', () => {
    it('validates its own props', () => {
      const spy = sinon.spy();

      type Props = { foo: string };

      class A extends ValueObject<Props> {
        protected validate(props: Props): void {
          spy(props);
        }
      }

      new A({ foo: 'bar' });

      expect(spy).to.have.been.calledWith({ foo: 'bar' });
    });

    it('has structural equality', () => {
      type Props = { foo: string };

      class A extends ValueObject<Props> {
        protected validate(): void {
          return;
        }
      }

      class B extends ValueObject<Props> {
        protected validate(): void {
          return;
        }
      }

      const a = new A({ foo: 'bar' });
      const b = new B({ foo: 'bar' });

      expect(a.equals(b)).to.be.true;
    });

    it('is not equal to null', () => {
      type Props = { foo: string };

      class A extends ValueObject<Props> {
        protected validate(): void {
          return;
        }
      }

      const a = new A({ foo: 'bar' });

      expect(a.equals(null)).to.be.false;
    });

    it('can be converted to string', () => {
      type Props = { foo: string };

      class A extends ValueObject<Props> {
        protected validate(): void {
          return;
        }
      }

      const a = new A({ foo: 'bar' });

      expect(a.toString()).to.be.equal('{"foo":"bar"}');
    });

    it('can be converted to object', () => {
      type Props = { foo: string };

      class A extends ValueObject<Props> {
        protected validate(): void {
          return;
        }
      }

      const a = new A({ foo: 'bar' });

      expect(a.toJSON()).to.be.deep.equal({ foo: 'bar' });
    });

    it('clones itself', () => {
      type Props = { foo: string; bar: string };

      class A extends ValueObject<Props> {
        protected validate(): void {
          return;
        }
      }

      const a = new A({ foo: 'foo', bar: 'bar' });
      const b = a.clone({ foo: 'bar' });

      expect(b.toJSON()).to.be.deep.equal({ foo: 'bar', bar: 'bar' });
      expect(b).to.be.instanceof(A);
    });
  });
});
