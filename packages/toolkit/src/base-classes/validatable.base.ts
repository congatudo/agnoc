import { ArgumentInvalidException } from '../exceptions/argument-invalid.exception';
import { ArgumentNotProvidedException } from '../exceptions/argument-not-provided.exception';
import { ArgumentOutOfRangeException } from '../exceptions/argument-out-of-range.exception';
import { isEmpty } from '../utils/is-empty.util';
import { isPresent } from '../utils/is-present.util';
import type { Constructor } from '../types/constructor.type';

export abstract class Validatable<T> {
  constructor(props: T) {
    this.checkIfEmpty(props);
    this.validate(props);
  }

  protected abstract validate(props: T): void;

  protected validateInListProp<T, K extends keyof T & string>(props: T, propName: K, list: T[K][]): void {
    const value = props[propName];

    if (isPresent(value) && !list.includes(value)) {
      throw new ArgumentInvalidException(
        `Value '${value as string}' for property '${propName}' of ${this.constructor.name} is not one of '${list.join(
          ', ',
        )}'`,
      );
    }
  }

  protected validatePositiveIntegerProp<T, K extends keyof T & string>(props: T, propName: K): void {
    const value = props[propName];

    if (isPresent(value) && (typeof value !== 'number' || !Number.isInteger(value) || value < 0)) {
      throw new ArgumentInvalidException(
        `Value '${value as string}' for property '${propName}' of ${this.constructor.name} is not a positive integer`,
      );
    }
  }

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

  protected validateDefinedProp<T, K extends keyof T & string>(props: T, propName: K): void {
    if (!isPresent(props[propName])) {
      throw new ArgumentNotProvidedException(`Property '${propName}' for ${this.constructor.name} not provided`);
    }
  }

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

  protected validateBooleanProp<T, K extends keyof T & string>(props: T, propName: K): void {
    const value = props[propName];

    if (isPresent(value) && typeof value !== 'boolean') {
      throw new ArgumentInvalidException(
        `Value '${value as string}' for property '${propName}' of ${this.constructor.name} is not a boolean`,
      );
    }
  }

  protected validateStringProp<T, K extends keyof T & string>(props: T, propName: K): void {
    const value = props[propName];

    if (isPresent(value) && typeof value !== 'string') {
      throw new ArgumentInvalidException(
        `Value '${value as string}' for property '${propName}' of ${this.constructor.name} is not a string`,
      );
    }
  }

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

interface NumberRange {
  min?: number;
  max?: number;
}
