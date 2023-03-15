import { expect } from 'chai';
import { Validatable } from './validatable.base';
import { ValueObject } from './value-object.base';

describe('value-object.base', function () {
  it('should be created', function () {
    type Props = { foo: string };

    class DummyValueObject extends ValueObject<Props> {
      protected validate(): void {
        return;
      }
    }

    const dummyValueObject = new DummyValueObject({ foo: 'bar' });

    expect(dummyValueObject).to.be.instanceOf(Validatable);
  });

  it('should have structural equality', function () {
    type Props = { foo: string };

    class FirstValueObject extends ValueObject<Props> {
      protected validate(): void {
        return;
      }
    }

    class SecondValueObject extends ValueObject<Props> {
      protected validate(): void {
        return;
      }
    }

    class ThirdValueObject extends ValueObject<Props & { bar: string }> {
      protected validate(): void {
        return;
      }
    }

    const firstValueObject = new FirstValueObject({ foo: 'bar' });
    const secondValueObject = new SecondValueObject({ foo: 'bar' });
    const thirdValueObject = new ThirdValueObject({ foo: 'bar', bar: 'baz' });

    expect(firstValueObject.equals(secondValueObject)).to.be.true;
    expect(firstValueObject.equals(thirdValueObject)).to.be.false;
  });

  it('should not be equal to null', function () {
    type Props = { foo: string };

    class DummyValueObject extends ValueObject<Props> {
      protected validate(): void {
        return;
      }
    }

    const dummyValueObject = new DummyValueObject({ foo: 'bar' });

    expect(dummyValueObject.equals(null)).to.be.false;
  });

  it('should be converted to string', function () {
    type Props = { foo: string };

    class DummyValueObject extends ValueObject<Props> {
      protected validate(): void {
        return;
      }
    }

    const dummyValueObject = new DummyValueObject({ foo: 'bar' });

    expect(dummyValueObject.toString()).to.be.equal('{"foo":"bar"}');
  });

  it('should be converted to object', function () {
    type Props = { foo: string };

    class DummyValueObject extends ValueObject<Props> {
      protected validate(): void {
        return;
      }
    }

    const dummyValueObject = new DummyValueObject({ foo: 'bar' });

    expect(dummyValueObject.toJSON()).to.be.deep.equal({ foo: 'bar' });
  });

  it('should clone itself', function () {
    type Props = { foo: string; bar: string };

    class DummyValueObject extends ValueObject<Props> {
      protected validate(): void {
        return;
      }
    }

    const dummyValueObject = new DummyValueObject({ foo: 'foo', bar: 'bar' });
    const cloneValueObject = dummyValueObject.clone({ foo: 'bar' });

    expect(cloneValueObject.toJSON()).to.be.deep.equal({ foo: 'bar', bar: 'bar' });
    expect(cloneValueObject).to.be.instanceof(DummyValueObject);
  });

  describe('#isValueObject', function () {
    it('should check if the instance is a value object', function () {
      type Props = { foo: string };

      class DummyValueObject extends ValueObject<Props> {
        protected validate(): void {
          return;
        }
      }

      const dummyValueObject = new DummyValueObject({ foo: 'bar' });

      expect(ValueObject.isValueObject(dummyValueObject)).to.be.true;
    });
  });
});
