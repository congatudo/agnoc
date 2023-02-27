import { ArgumentInvalidException } from '../exceptions/argument-invalid.exception';
import { ValueObject } from './value-object.base';

export type Primitives = string | number | boolean | bigint | Date;
export interface DomainPrimitiveProps<T extends Primitives> {
  value: T;
}

export abstract class DomainPrimitive<T extends Primitives> extends ValueObject<DomainPrimitiveProps<T>> {
  constructor(value: T) {
    checkIfPrimitiveValue(value);

    super({ value });
  }

  get value(): T {
    return this.props.value;
  }

  override toString(): string {
    if (this.props.value instanceof Date) {
      return this.props.value.toISOString();
    }

    return String(this.props.value);
  }

  override toJSON(): unknown {
    return this.props.value;
  }

  protected abstract override validate(props: DomainPrimitiveProps<T>): void;
}

function isPrimitiveValue(value: unknown): value is Primitives {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint' ||
    value instanceof Date
  );
}

function checkIfPrimitiveValue(value: unknown): void {
  if (!isPrimitiveValue(value)) {
    throw new ArgumentInvalidException('Cannot create a domain primitive from non-primitive value');
  }
}
