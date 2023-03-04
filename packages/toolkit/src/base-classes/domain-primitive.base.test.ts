import { expect } from 'chai';
import { ArgumentInvalidException } from '../exceptions/argument-invalid.exception';
import { DomainPrimitive } from './domain-primitive.base';
import { ValueObject } from './value-object.base';

describe('domain-primitive.base', function () {
  it('should create a domain primitive', function () {
    class DummyDomainPrimitive extends DomainPrimitive<string> {
      protected validate(): void {
        return;
      }
    }

    const dummyDomainPrimitive = new DummyDomainPrimitive('foo');

    expect(dummyDomainPrimitive).to.be.instanceof(ValueObject);
    expect(dummyDomainPrimitive.value).to.be.equal('foo');
  });

  it('should throw an error when value is not a primitive', function () {
    class DummyDomainPrimitive extends DomainPrimitive<string> {
      protected validate(): void {
        return;
      }
    }

    // @ts-expect-error - invalid value
    expect(() => new DummyDomainPrimitive({ value: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value '[object Object]' for DummyDomainPrimitive is not a primitive value`,
    );
  });

  describe('#toString', function () {
    it('should return a string representation of a string', function () {
      class DummyDomainPrimitive extends DomainPrimitive<string> {
        protected validate(): void {
          return;
        }
      }

      const dummyDomainPrimitive = new DummyDomainPrimitive('foo');

      expect(dummyDomainPrimitive.toString()).to.be.equal('foo');
    });

    it('should return a string representation of a number', function () {
      class DummyDomainPrimitive extends DomainPrimitive<number> {
        protected validate(): void {
          return;
        }
      }

      const dummyDomainPrimitive = new DummyDomainPrimitive(1);

      expect(dummyDomainPrimitive.toString()).to.be.equal('1');
    });

    it('should return a string representation of a boolean', function () {
      class DummyDomainPrimitive extends DomainPrimitive<boolean> {
        protected validate(): void {
          return;
        }
      }

      const dummyDomainPrimitive = new DummyDomainPrimitive(true);

      expect(dummyDomainPrimitive.toString()).to.be.equal('true');
    });

    it('should return a string representation of a bigint', function () {
      class DummyDomainPrimitive extends DomainPrimitive<bigint> {
        protected validate(): void {
          return;
        }
      }

      const dummyDomainPrimitive = new DummyDomainPrimitive(1n);

      expect(dummyDomainPrimitive.toString()).to.be.equal('1');
    });

    it('should return a string representation of a date', function () {
      class DummyDomainPrimitive extends DomainPrimitive<Date> {
        protected validate(): void {
          return;
        }
      }

      const dummyDomainPrimitive = new DummyDomainPrimitive(new Date('2020-01-01'));

      expect(dummyDomainPrimitive.toString()).to.be.equal('2020-01-01T00:00:00.000Z');
    });
  });

  describe('#toJSON', function () {
    it('should return a JSON representation of a string', function () {
      class DummyDomainPrimitive extends DomainPrimitive<string> {
        protected validate(): void {
          return;
        }
      }

      const dummyDomainPrimitive = new DummyDomainPrimitive('foo');

      expect(dummyDomainPrimitive.toJSON()).to.be.equal('foo');
    });

    it('should return a JSON representation of a number', function () {
      class DummyDomainPrimitive extends DomainPrimitive<number> {
        protected validate(): void {
          return;
        }
      }

      const dummyDomainPrimitive = new DummyDomainPrimitive(1);

      expect(dummyDomainPrimitive.toJSON()).to.be.equal(1);
    });

    it('should return a JSON representation of a boolean', function () {
      class DummyDomainPrimitive extends DomainPrimitive<boolean> {
        protected validate(): void {
          return;
        }
      }

      const dummyDomainPrimitive = new DummyDomainPrimitive(true);

      expect(dummyDomainPrimitive.toJSON()).to.be.equal(true);
    });

    it('should return a JSON representation of a bigint', function () {
      class DummyDomainPrimitive extends DomainPrimitive<bigint> {
        protected validate(): void {
          return;
        }
      }

      const dummyDomainPrimitive = new DummyDomainPrimitive(1n);

      expect(dummyDomainPrimitive.toJSON()).to.be.equal(1n);
    });

    it('should return a JSON representation of a date', function () {
      class DummyDomainPrimitive extends DomainPrimitive<Date> {
        protected validate(): void {
          return;
        }
      }

      const date = new Date('2020-01-01');
      const dummyDomainPrimitive = new DummyDomainPrimitive(date);

      expect(dummyDomainPrimitive.toJSON()).to.be.equal(date);
    });
  });
});
