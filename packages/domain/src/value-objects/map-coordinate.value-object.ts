import { ValueObject, isPresent, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';

/** Describe a coordinate in a map. */
export interface MapCoordinateProps {
  /** The x coordinate. */
  x: number;
  /** The y coordinate. */
  y: number;
}

/** Describe a coordinate in a map. */
export class MapCoordinate extends ValueObject<MapCoordinateProps> {
  /** Returns the x coordinate. */
  get x(): number {
    return this.props.x;
  }

  /** Returns the y coordinate. */
  get y(): number {
    return this.props.y;
  }

  protected validate(props: MapCoordinateProps): void {
    const keys = ['x', 'y'] as (keyof MapCoordinateProps)[];

    keys.forEach((prop) => {
      const value = props[prop];

      if (!isPresent(value)) {
        throw new ArgumentNotProvidedException(`Property '${prop}' for ${this.constructor.name} not provided`);
      }

      if (typeof value !== 'number') {
        throw new ArgumentInvalidException(
          `Value '${value as string}' of property '${prop}' for ${this.constructor.name} is not a number`,
        );
      }
    });
  }
}
