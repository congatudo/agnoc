import { expect } from 'chai';
import { describe, it } from 'mocha';
import { ArgumentNotProvidedException } from '../exceptions/argument-not-provided.exception';
import { ValueObject } from './value-object.base';

describe('value-object.base', () => {
  it('should throw an error when has no props', () => {
    class A extends ValueObject<void> {
      protected validate(): void {
        return;
      }
    }

    expect(() => new A()).to.throws(ArgumentNotProvidedException);
  });

  it('should validate its own props', (done) => {
    type Props = { foo: string };

    class A extends ValueObject<Props> {
      protected validate(props: Props): void {
        expect(props).to.contain({ foo: 'bar' });
        done();
      }
    }

    new A({ foo: 'bar' });
  });

  it('should have structural equality', () => {
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

    class C extends ValueObject<Props & { bar: string }> {
      protected validate(): void {
        return;
      }
    }

    const a = new A({ foo: 'bar' });
    const b = new B({ foo: 'bar' });
    const c = new C({ foo: 'bar', bar: 'baz' });

    expect(a.equals(b)).to.be.true;
    expect(a.equals(c)).to.be.false;
  });

  it('should not be equal to null', () => {
    type Props = { foo: string };

    class A extends ValueObject<Props> {
      protected validate(): void {
        return;
      }
    }

    const a = new A({ foo: 'bar' });

    expect(a.equals(null)).to.be.false;
  });

  it('should be converted to string', () => {
    type Props = { foo: string };

    class A extends ValueObject<Props> {
      protected validate(): void {
        return;
      }
    }

    const a = new A({ foo: 'bar' });

    expect(a.toString()).to.be.equal('{"foo":"bar"}');
  });

  it('should be converted to object', () => {
    type Props = { foo: string };

    class A extends ValueObject<Props> {
      protected validate(): void {
        return;
      }
    }

    const a = new A({ foo: 'bar' });

    expect(a.toJSON()).to.be.deep.equal({ foo: 'bar' });
  });

  it('should clone itself', () => {
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

  describe('#isValueObject', () => {
    it('should check if the instance is a value object', () => {
      type Props = { foo: string };

      class A extends ValueObject<Props> {
        protected validate(): void {
          return;
        }
      }

      const a = new A({ foo: 'bar' });

      expect(ValueObject.isValueObject(a)).to.be.true;
    });
  });
});
