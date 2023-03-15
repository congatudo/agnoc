import { convertPropsToObject } from '../utils/convert-props-to-object.util';
import { isPresent } from '../utils/is-present.util';
import { Validatable } from './validatable.base';

/** Abstract base class that provides basic tools for building the value objects of the domain. */
export abstract class ValueObject<T> extends Validatable<T> {
  protected readonly props: T;

  constructor(props: T) {
    super(props);
    this.props = props;
  }

  /** Checks whether the provided value object is equal to this one. */
  equals(vo?: unknown): boolean {
    if (!isPresent(vo)) {
      return false;
    }

    return JSON.stringify(this) === JSON.stringify(vo);
  }

  /** Returns a string representation of this value object. */
  override toString(): string {
    return JSON.stringify(this.toJSON());
  }

  /** Returns a JSON representation of this value object. */
  toJSON(): unknown {
    const propsCopy = convertPropsToObject(this.props);

    return Object.freeze(propsCopy as T);
  }

  /** Creates a new instance of this value object with the provided props. */
  clone<C extends ValueObject<T>>(this: C, props: Partial<T>): C {
    const ctor = this.constructor as new (props: T) => C;

    return new ctor({
      ...this.props,
      ...props,
    });
  }

  /** Checks whether the provided object is a value object. */
  static isValueObject(obj: unknown): obj is ValueObject<unknown> {
    return obj instanceof ValueObject;
  }
}
