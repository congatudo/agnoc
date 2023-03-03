import { expect } from 'chai';
import { ArgumentInvalidException } from '../exceptions/argument-invalid.exception';
import { ArgumentNotProvidedException } from '../exceptions/argument-not-provided.exception';
import { ArgumentOutOfRangeException } from '../exceptions/argument-out-of-range.exception';
import { Validatable } from './validatable.base';

describe('Validatable', function () {
  it('should check for empty props', function () {
    type ValidatableProps = { foo: string };

    class DummyValidatable extends Validatable<ValidatableProps> {
      protected validate(_: ValidatableProps): void {
        // noop
      }
    }

    // @ts-expect-error - missing properties
    expect(() => new DummyValidatable()).to.throw(
      ArgumentNotProvidedException,
      'Cannot create DummyValidatable from empty properties',
    );
  });

  it('should invoke validate method', function () {
    type ValidatableProps = { foo: string };

    class DummyValidatable extends Validatable<ValidatableProps> {
      protected validate(props: ValidatableProps): void {
        expect(props).to.deep.equal({ foo: 'bar' });
      }
    }

    new DummyValidatable({ foo: 'bar' });
  });

  describe('#validateInListProp()', function () {
    it('should validate optional values', function () {
      type ValidatableProps = { foo?: string };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validateInListProp(props, 'foo', ['foo', 'bar']);
        }
      }

      new DummyValidatable({ foo: undefined });
    });

    it('should validate prop in list', function () {
      type ValidatableProps = { foo: string };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validateInListProp(props, 'foo', ['foo', 'bar']);
        }
      }

      new DummyValidatable({ foo: 'bar' });
    });

    it('should throw an error when prop is not in list', function () {
      type ValidatableProps = { foo: string };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validateInListProp(props, 'foo', ['foo', 'bar']);
        }
      }

      expect(() => new DummyValidatable({ foo: 'baz' })).to.throw(
        ArgumentInvalidException,
        `Value 'baz' for property 'foo' of DummyValidatable is not one of 'foo, bar'`,
      );
    });
  });

  describe('#validatePositiveIntegerProp()', function () {
    it('should validate nullable values', function () {
      type ValidatableProps = { foo?: number };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validatePositiveIntegerProp(props, 'foo');
        }
      }

      new DummyValidatable({ foo: undefined });
    });

    it('should validate positive integer', function () {
      type ValidatableProps = { foo: number };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validatePositiveIntegerProp(props, 'foo');
        }
      }

      new DummyValidatable({ foo: 1 });
    });

    it('should throw an error when prop is not a number', function () {
      type ValidatableProps = { foo: number };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validatePositiveIntegerProp(props, 'foo');
        }
      }

      // @ts-expect-error - invalid property
      expect(() => new DummyValidatable({ foo: 'foo' })).to.throw(
        ArgumentInvalidException,
        `Value 'foo' for property 'foo' of DummyValidatable is not a positive integer`,
      );
    });

    it('should throw an error when prop is not a integer', function () {
      type ValidatableProps = { foo: number };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validatePositiveIntegerProp(props, 'foo');
        }
      }

      expect(() => new DummyValidatable({ foo: 0.5 })).to.throw(
        ArgumentInvalidException,
        `Value '0.5' for property 'foo' of DummyValidatable is not a positive integer`,
      );
    });

    it('should throw an error when prop is not positive', function () {
      type ValidatableProps = { foo: number };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validatePositiveIntegerProp(props, 'foo');
        }
      }

      expect(() => new DummyValidatable({ foo: -5 })).to.throw(
        ArgumentInvalidException,
        `Value '-5' for property 'foo' of DummyValidatable is not a positive integer`,
      );
    });
  });

  describe('#validateNumberProps()', function () {
    it('should validate optional values', function () {
      type ValidatableProps = { foo?: number };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validateNumberProp(props, 'foo');
        }
      }

      new DummyValidatable({ foo: undefined });
    });

    it('should validate number', function () {
      type ValidatableProps = { foo: number };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validateNumberProp(props, 'foo');
        }
      }

      new DummyValidatable({ foo: 1 });
    });

    it('should validate number in range', function () {
      type ValidatableProps = { foo: number };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validateNumberProp(props, 'foo', { min: 0, max: 2 });
        }
      }

      new DummyValidatable({ foo: 1 });
    });

    it('should validate number in min range', function () {
      type ValidatableProps = { foo: number };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validateNumberProp(props, 'foo', { min: 0 });
        }
      }

      new DummyValidatable({ foo: 1 });
    });

    it('should validate number in max range', function () {
      type ValidatableProps = { foo: number };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validateNumberProp(props, 'foo', { max: 2 });
        }
      }

      new DummyValidatable({ foo: 1 });
    });

    it('should throw an error when prop is not a number', function () {
      type ValidatableProps = { foo: number };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validateNumberProp(props, 'foo');
        }
      }

      // @ts-expect-error - invalid property
      expect(() => new DummyValidatable({ foo: 'foo' })).to.throw(
        ArgumentInvalidException,
        `Value 'foo' for property 'foo' of DummyValidatable is not a number`,
      );
    });

    it('should throw an error when prop is not in range', function () {
      type ValidatableProps = { foo: number };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validateNumberProp(props, 'foo', { min: 0, max: 2 });
        }
      }

      expect(() => new DummyValidatable({ foo: 3 })).to.throw(
        ArgumentOutOfRangeException,
        `Value '3' for property 'foo' of DummyValidatable is out of range [0, 2]`,
      );
    });

    it('should throw an error when prop is not in min range', function () {
      type ValidatableProps = { foo: number };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validateNumberProp(props, 'foo', { min: 0 });
        }
      }

      expect(() => new DummyValidatable({ foo: -1 })).to.throw(
        ArgumentOutOfRangeException,
        `Value '-1' for property 'foo' of DummyValidatable is out of range [0, ...]`,
      );
    });

    it('should throw an error when prop is not in max range', function () {
      type ValidatableProps = { foo: number };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validateNumberProp(props, 'foo', { max: 2 });
        }
      }

      expect(() => new DummyValidatable({ foo: 3 })).to.throw(
        ArgumentOutOfRangeException,
        `Value '3' for property 'foo' of DummyValidatable is out of range [..., 2]`,
      );
    });
  });

  describe('#validateDefinedProp()', function () {
    it('should validate defined values', function () {
      type ValidatableProps = { foo: string };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validateDefinedProp(props, 'foo');
        }
      }

      new DummyValidatable({ foo: 'bar' });
    });

    it('should throw an error when prop is not defined', function () {
      type ValidatableProps = { foo: string };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validateDefinedProp(props, 'foo');
        }
      }

      // @ts-expect-error - invalid property
      expect(() => new DummyValidatable({ bar: 'baz' })).to.throw(
        ArgumentNotProvidedException,
        `Property 'foo' for DummyValidatable not provided`,
      );
    });
  });

  describe('#validateInstanceOfProp()', function () {
    it('should validate optional values', function () {
      type ValidatableProps = { foo?: Date };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validateInstanceProp(props, 'foo', Date);
        }
      }

      new DummyValidatable({ foo: undefined });
    });

    it('should validate instances', function () {
      type ValidatableProps = { foo: Date };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validateInstanceProp(props, 'foo', Date);
        }
      }

      new DummyValidatable({ foo: new Date() });
    });

    it('should throw an error when prop is not a valid instance', function () {
      type ValidatableProps = { foo: Date };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validateInstanceProp(props, 'foo', Date);
        }
      }

      // @ts-expect-error - invalid property
      expect(() => new DummyValidatable({ foo: 'foo' })).to.throw(
        ArgumentInvalidException,
        `Value 'foo' for property 'foo' of DummyValidatable is not an instance of Date`,
      );
    });
  });

  describe('#validateBooleanProp()', function () {
    it('should validate optional values', function () {
      type ValidatableProps = { foo?: boolean };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validateBooleanProp(props, 'foo');
        }
      }

      new DummyValidatable({ foo: undefined });
    });

    it('should validate boolean', function () {
      type ValidatableProps = { foo: boolean };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validateBooleanProp(props, 'foo');
        }
      }

      new DummyValidatable({ foo: true });
    });

    it('should throw an error when prop is not a boolean', function () {
      type ValidatableProps = { foo: boolean };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validateBooleanProp(props, 'foo');
        }
      }

      // @ts-expect-error - invalid property
      expect(() => new DummyValidatable({ foo: 'foo' })).to.throw(
        ArgumentInvalidException,
        `Value 'foo' for property 'foo' of DummyValidatable is not a boolean`,
      );
    });
  });

  describe('#validateStringProp()', function () {
    it('should validate optional values', function () {
      type ValidatableProps = { foo?: string };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validateStringProp(props, 'foo');
        }
      }

      new DummyValidatable({ foo: undefined });
    });

    it('should validate string', function () {
      type ValidatableProps = { foo: string };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validateStringProp(props, 'foo');
        }
      }

      new DummyValidatable({ foo: 'bar' });
    });

    it('should throw an error when prop is not a string', function () {
      type ValidatableProps = { foo: string };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validateStringProp(props, 'foo');
        }
      }

      // @ts-expect-error - invalid property
      expect(() => new DummyValidatable({ foo: 1 })).to.throw(
        ArgumentInvalidException,
        `Value '1' for property 'foo' of DummyValidatable is not a string`,
      );
    });
  });

  describe('#validateArrayOfProp()', function () {
    it('should validate optional values', function () {
      type ValidatableProps = { foo?: string[] };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validateArrayProp(props, 'foo', String);
        }
      }

      new DummyValidatable({ foo: undefined });
    });

    it('should validate array', function () {
      type ValidatableProps = { foo: Date[] };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validateArrayProp(props, 'foo', Date);
        }
      }

      new DummyValidatable({ foo: [new Date()] });
    });

    it('should throw an error when prop is not an array', function () {
      type ValidatableProps = { foo: string[] };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validateArrayProp(props, 'foo', String);
        }
      }

      // @ts-expect-error - invalid property
      expect(() => new DummyValidatable({ foo: 'foo' })).to.throw(
        ArgumentInvalidException,
        `Value 'foo' for property 'foo' of DummyValidatable is not an array`,
      );
    });

    it('should throw an error when prop is not an array of strings', function () {
      type ValidatableProps = { foo: string[] };

      class DummyValidatable extends Validatable<ValidatableProps> {
        protected validate(props: ValidatableProps): void {
          this.validateArrayProp(props, 'foo', String);
        }
      }

      // @ts-expect-error - invalid property
      expect(() => new DummyValidatable({ foo: [1] })).to.throw(
        ArgumentInvalidException,
        `Value '1' for property 'foo' of DummyValidatable is not an array of String`,
      );
    });
  });
});
