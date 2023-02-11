import { ArgumentNotProvidedException } from '../exceptions/argument-not-provided.exception';
import { convertPropsToObject } from '../utils/convert-props-to-object.util';
import { isEmpty } from '../utils/is-empty.util';
import { isPresent } from '../utils/is-present.util';

export type Primitives = string | number | boolean | bigint;
export interface DomainPrimitive<T extends Primitives | Date> {
  value: T;
}

type ValueObjectProps<T> = T extends Primitives | Date ? DomainPrimitive<T> : T;
type PartialValueObjectProps<T> = T extends Primitives | Date ? DomainPrimitive<T> : Partial<T>;

export abstract class ValueObject<T> {
  protected readonly props: ValueObjectProps<T>;

  constructor(props: ValueObjectProps<T>) {
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
    if (this.isDomainPrimitive(this.props)) {
      return String(this.props.value);
    }

    return JSON.stringify(this.toJSON());
  }

  toJSON(): unknown {
    if (this.isDomainPrimitive(this.props)) {
      return this.props.value;
    }

    const propsCopy = convertPropsToObject(this.props);

    return Object.freeze(propsCopy as T);
  }

  clone<C extends ValueObject<T>>(this: C, props: PartialValueObjectProps<T>): C {
    const ctor = this.constructor as new (props: ValueObjectProps<T>) => C;

    return new ctor({
      ...this.props,
      ...props,
    });
  }

  protected abstract validate(props: ValueObjectProps<T>): void;

  private checkIfEmpty(props: ValueObjectProps<T>): void {
    if (isEmpty(props) || (this.isDomainPrimitive(props) && isEmpty(props.value))) {
      throw new ArgumentNotProvidedException('Property cannot be empty');
    }
  }

  private isDomainPrimitive(obj: unknown): obj is DomainPrimitive<T & (Primitives | Date)> {
    if (Object.prototype.hasOwnProperty.call(obj, 'value')) {
      return true;
    }
    return false;
  }

  static isValueObject(obj: unknown): obj is ValueObject<unknown> {
    return obj instanceof ValueObject;
  }
}
