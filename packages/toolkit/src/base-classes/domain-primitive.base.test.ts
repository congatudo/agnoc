import { expect } from 'chai';
import { ArgumentInvalidException } from '../exceptions/argument-invalid.exception';
import { DomainPrimitive } from './domain-primitive.base';
import { ValueObject } from './value-object.base';

describe('domain-primitive.base', function () {
  it('should create a domain primitive', function () {
    class A extends DomainPrimitive<string> {
      protected validate(): void {
        return;
      }
    }

    const a = new A('foo');

    expect(a).to.be.instanceof(ValueObject);
    expect(a.value).to.be.equal('foo');
  });

  it('should throw an error when value is not a primitive', function () {
    class A extends DomainPrimitive<string> {
      protected validate(): void {
        return;
      }
    }

    // @ts-expect-error - invalid value
    expect(() => new A({ value: 'foo' })).to.throw(
      ArgumentInvalidException,
      'Cannot create a domain primitive from non-primitive value',
    );
  });

  describe('#toString', function () {
    it('should return a string representation of a string', function () {
      class A extends DomainPrimitive<string> {
        protected validate(): void {
          return;
        }
      }

      const a = new A('foo');

      expect(a.toString()).to.be.equal('foo');
    });

    it('should return a string representation of a number', function () {
      class A extends DomainPrimitive<number> {
        protected validate(): void {
          return;
        }
      }

      const a = new A(1);

      expect(a.toString()).to.be.equal('1');
    });

    it('should return a string representation of a boolean', function () {
      class A extends DomainPrimitive<boolean> {
        protected validate(): void {
          return;
        }
      }

      const a = new A(true);

      expect(a.toString()).to.be.equal('true');
    });

    it('should return a string representation of a bigint', function () {
      class A extends DomainPrimitive<bigint> {
        protected validate(): void {
          return;
        }
      }

      const a = new A(1n);

      expect(a.toString()).to.be.equal('1');
    });

    it('should return a string representation of a date', function () {
      class A extends DomainPrimitive<Date> {
        protected validate(): void {
          return;
        }
      }

      const a = new A(new Date('2020-01-01'));

      expect(a.toString()).to.be.equal('2020-01-01T00:00:00.000Z');
    });
  });

  describe('#toJSON', function () {
    it('should return a JSON representation of a string', function () {
      class A extends DomainPrimitive<string> {
        protected validate(): void {
          return;
        }
      }

      const a = new A('foo');

      expect(a.toJSON()).to.be.equal('foo');
    });

    it('should return a JSON representation of a number', function () {
      class A extends DomainPrimitive<number> {
        protected validate(): void {
          return;
        }
      }

      const a = new A(1);

      expect(a.toJSON()).to.be.equal(1);
    });

    it('should return a JSON representation of a boolean', function () {
      class A extends DomainPrimitive<boolean> {
        protected validate(): void {
          return;
        }
      }

      const a = new A(true);

      expect(a.toJSON()).to.be.equal(true);
    });

    it('should return a JSON representation of a bigint', function () {
      class A extends DomainPrimitive<bigint> {
        protected validate(): void {
          return;
        }
      }

      const a = new A(1n);

      expect(a.toJSON()).to.be.equal(1n);
    });

    it('should return a JSON representation of a date', function () {
      class A extends DomainPrimitive<Date> {
        protected validate(): void {
          return;
        }
      }

      const date = new Date('2020-01-01');
      const a = new A(date);

      expect(a.toJSON()).to.be.equal(date);
    });
  });
});
