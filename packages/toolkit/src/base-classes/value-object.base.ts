import { convertPropsToObject } from '../utils/convert-props-to-object.util';
import { isPresent } from '../utils/is-present.util';
import { Validatable } from './validatable.base';

export abstract class ValueObject<T> extends Validatable<T> {
  protected readonly props: T;

  constructor(props: T) {
    super(props);
    this.props = props;
  }

  equals(vo?: unknown): boolean {
    if (!isPresent(vo)) {
      return false;
    }

    return JSON.stringify(this) === JSON.stringify(vo);
  }

  override toString(): string {
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

  static isValueObject(obj: unknown): obj is ValueObject<unknown> {
    return obj instanceof ValueObject;
  }
}
