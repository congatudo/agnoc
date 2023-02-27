import { ArgumentNotProvidedException } from '../exceptions/argument-not-provided.exception';
import { convertPropsToObject } from '../utils/convert-props-to-object.util';
import { isEmpty } from '../utils/is-empty.util';
import { isPresent } from '../utils/is-present.util';

export abstract class ValueObject<T> {
  protected readonly props: T;

  constructor(props: T) {
    this.checkIfEmpty(props);
    this.validate(props);
    this.props = props;
  }

  equals(vo?: unknown): boolean {
    if (!isPresent(vo)) {
      return false;
    }

    return JSON.stringify(this) === JSON.stringify(vo);
  }

  toString(): string {
    return JSON.stringify(this.toJSON());
  }

  toJSON(): unknown {
    const propsCopy = convertPropsToObject(this.props);

    return Object.freeze(propsCopy as T);
  }

  clone<C extends ValueObject<T>>(this: C, props: Partial<T>): C {
    const ctor = this.constructor as new (props: T) => C;

    return new ctor({
      ...this.props,
      ...props,
    });
  }

  protected abstract validate(props: T): void;

  private checkIfEmpty(props: T): void {
    if (isEmpty(props)) {
      throw new ArgumentNotProvidedException('Cannot create a value object from empty props');
    }
  }

  static isValueObject(obj: unknown): obj is ValueObject<unknown> {
    return obj instanceof ValueObject;
  }
}
