import { ArgumentOutOfRangeException } from '../exceptions/argument-out-of-range.exception';

interface Range {
  min: number;
  max: number;
}

export function interpolate(value: number, from: Range, to: Range): number {
  if (value < from.min || value > from.max) {
    throw new ArgumentOutOfRangeException(
      `Value '${value}' is out of range of min '${from.min}' and max '${from.max}'`,
    );
  }
  return ((value - from.min) * (to.max - to.min)) / (from.max - from.min) + to.min;
}
