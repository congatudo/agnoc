import { Entity, isPresent, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
import { MapCoordinate } from '../value-objects/map-coordinate.value-object';
import { MapPixel } from '../value-objects/map-pixel.value-object';
import type { EntityProps } from '@agnoc/toolkit';

/** Describes the properties of a room. */
export interface RoomProps extends EntityProps {
  /** The name of the room. */
  name: string;
  /** Whether the room is enabled or not. */
  isEnabled: boolean;
  /** The center of the room. */
  center: MapCoordinate;
  /** The pixels that make up the room. */
  pixels: MapPixel[];
}

/** Describes a room in the map. */
export class Room extends Entity<RoomProps> {
  /** Returns the name of the room. */
  get name(): string {
    return this.props.name;
  }

  /** Returns whether the room is enabled. */
  get isEnabled(): boolean {
    return this.props.isEnabled;
  }

  /** Returns the center of the room. */
  get center(): MapCoordinate {
    return this.props.center;
  }

  /** Returns the pixels that make up the room. */
  get pixels(): MapPixel[] {
    return this.props.pixels;
  }

  protected validate(props: RoomProps): void {
    const keys = ['name', 'isEnabled', 'center', 'pixels'] as (keyof RoomProps)[];

    keys.forEach((prop) => {
      if (!isPresent(props[prop])) {
        throw new ArgumentNotProvidedException(`Property '${prop}' for ${this.constructor.name} not provided`);
      }
    });

    if (typeof props.name !== 'string') {
      throw new ArgumentInvalidException(`Property 'name' for ${this.constructor.name} is not a string`);
    }

    if (typeof props.isEnabled !== 'boolean') {
      throw new ArgumentInvalidException(`Property 'isEnabled' for ${this.constructor.name} is not a boolean`);
    }

    if (!(props.center instanceof MapCoordinate)) {
      throw new ArgumentInvalidException(`Property 'center' for ${this.constructor.name} is not a MapCoordinate`);
    }

    if (!Array.isArray(props.pixels) || !props.pixels.every((pixel) => pixel instanceof MapPixel)) {
      throw new ArgumentInvalidException(`Property 'pixels' for ${this.constructor.name} is not an array of MapPixel`);
    }
  }
}
