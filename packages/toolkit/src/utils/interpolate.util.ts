import { ArgumentOutOfRangeException } from '../exceptions/argument-out-of-range.exception';

/** Range of values to interpolate from. */
export interface InterpolateRange {
  /** Minimum value of the range. */
  min: number;
  /** Maximum value of the range. */
  max: number;
}

/** Interpolate a value from one range to another. */
export function interpolate(value: number, from: InterpolateRange, to: InterpolateRange): number {
  if (value < from.min || value > from.max) {
    throw new ArgumentOutOfRangeException(
      `Value '${value}' is out of range of min '${from.min}' and max '${from.max}'`,
    );
  }

  return ((value - from.min) * (to.max - to.min)) / (from.max - from.min) + to.min;
}
