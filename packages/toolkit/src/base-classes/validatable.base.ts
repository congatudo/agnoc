import { ArgumentInvalidException } from '../exceptions/argument-invalid.exception';
import { ArgumentNotProvidedException } from '../exceptions/argument-not-provided.exception';
import { ArgumentOutOfRangeException } from '../exceptions/argument-out-of-range.exception';
import { isEmpty } from '../utils/is-empty.util';
import { isPresent } from '../utils/is-present.util';
import type { Constructor } from '../types/constructor.type';

/** Abstract base class that provides basic validation tools for building blocks of the domain. */
export abstract class Validatable<T> {
  /** Checks if the provided props are empty and invokes the `validate` method. */
  constructor(props: T) {
    this.checkIfEmpty(props);
    this.validate(props);
  }

  /** Implement this method to provide validation logic for the provided props. */
  protected abstract validate(props: T): void;

  /** Checks whether a prop is included in a list. */
  protected validateListProp<T, K extends keyof T & string>(props: T, propName: K, list: T[K][]): void {
    const value = props[propName];

    if (isPresent(value) && !list.includes(value)) {
      throw new ArgumentInvalidException(
        `Value '${value as string}' for property '${propName}' of ${this.constructor.name} is invalid`,
      );
    }
  }

  /** Checks whether a prop is a positive integer. */
  protected validatePositiveIntegerProp<T, K extends keyof T & string>(props: T, propName: K): void {
    const value = props[propName];

    if (isPresent(value) && (typeof value !== 'number' || !Number.isInteger(value) || value < 0)) {
      throw new ArgumentInvalidException(
        `Value '${value as string}' for property '${propName}' of ${this.constructor.name} is not a positive integer`,
      );
    }
  }

  /** Checks whether a prop is a number. Optionally check if the number is contained in a range. */
  protected validateNumberProp<T, K extends keyof T & string>(props: T, propName: K, range?: NumberRange): void {
    const value = props[propName];

    if (!isPresent(value)) {
      return;
    }

    if (typeof value !== 'number') {
      throw new ArgumentInvalidException(
        `Value '${value as string}' for property '${propName}' of ${this.constructor.name} is not a number`,
      );
    }

    if (range) {
      if ((isPresent(range.min) && value < range.min) || (isPresent(range.max) && value > range.max)) {
        throw new ArgumentOutOfRangeException(
          `Value '${value}' for property '${propName}' of ${this.constructor.name} is out of range [${
            range.min ?? '...'
          }, ${range.max ?? '...'}]`,
        );
      }
    }
  }

  /** Checks whether a prop is defined. */
  protected validateDefinedProp<T, K extends keyof T & string>(props: T, propName: K): void {
    if (!isPresent(props[propName])) {
      throw new ArgumentNotProvidedException(`Property '${propName}' for ${this.constructor.name} not provided`);
    }
  }

  /** Checks whether a prop is an instance of a class. */
  protected validateInstanceProp<T, K extends keyof T & string>(props: T, propName: K, ctor: Constructor): void {
    const value = props[propName];

    if (isPresent(value) && !(value instanceof ctor)) {
      throw new ArgumentInvalidException(
        `Value '${value as string}' for property '${propName}' of ${this.constructor.name} is not an instance of ${
          ctor.name
        }`,
      );
    }
  }

  /** Checks whether a prop is of a certain type. */
  protected validateTypeProp<T, K extends keyof T & string>(props: T, propName: K, type: string): void {
    const value = props[propName];

    if (isPresent(value) && typeof value !== type) {
      throw new ArgumentInvalidException(
        `Value '${value as string}' for property '${propName}' of ${this.constructor.name} is not a ${type}`,
      );
    }
  }

  /** Checks whether a prop is an array of instances of a class. */
  protected validateArrayProp<T, K extends keyof T & string>(props: T, propName: K, ctor: Constructor): void {
    const value = props[propName];

    if (!isPresent(value)) {
      return;
    }

    if (!Array.isArray(value)) {
      throw new ArgumentInvalidException(
        `Value '${value as string}' for property '${propName}' of ${this.constructor.name} is not an array`,
      );
    }

    if (!value.every((item) => item instanceof ctor)) {
      throw new ArgumentInvalidException(
        `Value '${value.join(', ')}' for property '${propName}' of ${this.constructor.name} is not an array of ${
          ctor.name
        }`,
      );
    }
  }

  private checkIfEmpty(props: T): void {
    if (isEmpty(props)) {
      throw new ArgumentNotProvidedException(`Cannot create ${this.constructor.name} from empty properties`);
    }
  }
}

export interface NumberRange {
  min?: number;
  max?: number;
}
