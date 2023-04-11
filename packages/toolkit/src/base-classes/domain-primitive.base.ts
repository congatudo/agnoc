import { ArgumentInvalidException } from '../exceptions/argument-invalid.exception';
import { ValueObject } from './value-object.base';

/** Possible domain primitive types. */
export type DomainPrimitives = string | number | boolean | bigint | Date;

/** Props for the DomainPrimitive class. */
export interface DomainPrimitiveProps<T extends DomainPrimitives> {
  /** The value of the primitive. */
  value: T;
}

/** Abstract base class that provides basic tools for building the domain primitives of the domain. */
export abstract class DomainPrimitive<T extends DomainPrimitives> extends ValueObject<DomainPrimitiveProps<T>> {
  /** Checks if the provided value is a primitive value. */
  constructor(value: T) {
    checkIfPrimitiveValue(new.target.name, value);

    super({ value });
  }

  /** Returns the value of the primitive. */
  get value(): T {
    return this.props.value;
  }

  /** Returns a string representation of this primitive. */
  override toString(): string {
    if (this.props.value instanceof Date) {
      return this.props.value.toISOString();
    }

    return String(this.props.value);
  }

  /** Returns a JSON representation of this primitive. */
  override toJSON(): unknown {
    return this.props.value;
  }

  /** Implement this method to provide validation logic for the provided props. */
  protected abstract override validate(props: DomainPrimitiveProps<T>): void;
}

function isPrimitiveValue(value: unknown): value is DomainPrimitives {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint' ||
    value instanceof Date
  );
}

function checkIfPrimitiveValue(className: string, value: unknown): void {
  if (!isPrimitiveValue(value)) {
    throw new ArgumentInvalidException(`Value '${value as string}' for ${className} is not a primitive value`);
  }
}
