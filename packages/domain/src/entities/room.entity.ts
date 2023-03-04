import { Entity } from '@agnoc/toolkit';
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
    const keys: (keyof RoomProps)[] = ['name', 'isEnabled', 'center', 'pixels'];

    keys.forEach((prop) => {
      this.validateDefinedProp(props, prop);
    });

    this.validateTypeProp(props, 'name', 'string');
    this.validateTypeProp(props, 'isEnabled', 'boolean');
    this.validateInstanceProp(props, 'center', MapCoordinate);
    this.validateArrayProp(props, 'pixels', MapPixel);
  }
}
