import { ValueObject, isPresent, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
import { MapCoordinate } from './map-coordinate.value-object';

/** Describe a position in a map. */
export interface MapPositionProps {
  /** The x coordinate. */
  x: number;
  /** The y coordinate. */
  y: number;
  /** The phi angle. */
  phi: number;
}

/** Describe a position in a map. */
export class MapPosition extends ValueObject<MapPositionProps> {
  /** Returns the x coordinate. */
  get x(): number {
    return this.props.x;
  }

  /** Returns the y coordinate. */
  get y(): number {
    return this.props.y;
  }

  /** Returns the phi angle. */
  get phi(): number {
    return this.props.phi;
  }

  /** Returns the degrees angle. */
  get degrees(): number {
    return ((this.phi + Math.PI) * 180.0) / Math.PI - 90.0;
  }

  /** Returns the map coordinate. */
  toCoordinates(): MapCoordinate {
    return new MapCoordinate({ x: this.x, y: this.y });
  }

  protected validate(props: MapPositionProps): void {
    const keys = ['x', 'y', 'phi'] as (keyof MapPositionProps)[];

    keys.forEach((prop) => {
      const value = props[prop];

      if (!isPresent(value)) {
        throw new ArgumentNotProvidedException(`Property '${prop}' for map position not provided`);
      }

      if (typeof value !== 'number') {
        throw new ArgumentInvalidException(
          `Value '${value as string}' of property '${prop}' for map position is not a number`,
        );
      }
    });
  }
}
