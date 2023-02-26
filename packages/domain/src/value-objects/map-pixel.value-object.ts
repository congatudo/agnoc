import { ValueObject, isPresent, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';

/** Describe a pixel in a map. */
export interface MapPixelProps {
  /** The x coordinate. */
  x: number;
  /** The y coordinate. */
  y: number;
}

/** Describe a pixel in a map. */
export class MapPixel extends ValueObject<MapPixelProps> {
  /** Returns the x coordinate. */
  get x(): number {
    return this.props.x;
  }

  /** Returns the y coordinate. */
  get y(): number {
    return this.props.y;
  }

  protected validate(props: MapPixelProps): void {
    const keys = ['x', 'y'] as (keyof MapPixelProps)[];

    keys.forEach((prop) => {
      const value = props[prop];

      if (!isPresent(value)) {
        throw new ArgumentNotProvidedException(`Property '${prop}' for map pixel not provided`);
      }

      if (!Number.isInteger(value) || value < 0) {
        throw new ArgumentInvalidException(
          `Value '${value}' for property '${prop}' for map pixel is not a positive integer`,
        );
      }
    });
  }
}
