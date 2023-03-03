import { ValueObject } from '@agnoc/toolkit';

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
    const keys: (keyof MapCoordinateProps)[] = ['x', 'y'];

    keys.forEach((prop) => {
      this.validateDefinedProp(props, prop);
      this.validateNumberProp(props, prop);
    });
  }
}
