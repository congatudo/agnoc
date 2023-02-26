import { ArgumentOutOfRangeException } from '../exceptions/argument-out-of-range.exception';

export interface InterpolateRange {
  min: number;
  max: number;
}

export function interpolate(value: number, from: InterpolateRange, to: InterpolateRange): number {
  if (value < from.min || value > from.max) {
    throw new ArgumentOutOfRangeException(
      `Value '${value}' is out of range of min '${from.min}' and max '${from.max}'`,
    );
  }

  return ((value - from.min) * (to.max - to.min)) / (from.max - from.min) + to.min;
}
