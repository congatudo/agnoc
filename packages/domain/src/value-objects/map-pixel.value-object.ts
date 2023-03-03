import { ValueObject } from '@agnoc/toolkit';

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
    const keys: (keyof MapPixelProps)[] = ['x', 'y'];

    keys.forEach((prop) => {
      this.validateDefinedProp(props, prop);
      this.validatePositiveIntegerProp(props, prop);
    });
  }
}
