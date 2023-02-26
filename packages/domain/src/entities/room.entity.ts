import { ID, Entity, isPresent, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
import { MapCoordinate } from '../value-objects/map-coordinate.value-object';
import type { MapPixel } from '../value-objects/map-pixel.value-object';

export interface RoomProps {
  id: ID;
  name: string;
  isEnabled: boolean;
  center: MapCoordinate;
  pixels: MapPixel[];
}

export class Room extends Entity<RoomProps> {
  constructor(props: RoomProps) {
    super(props);
    this.validate(props);
  }

  override get id(): ID {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get isEnabled(): boolean {
    return this.props.isEnabled;
  }

  get center(): MapCoordinate {
    return this.props.center;
  }

  get pixels(): MapPixel[] {
    return this.props.pixels;
  }

  private validate(props: RoomProps): void {
    if (![props.id, props.name, props.isEnabled, props.center, props.pixels].every(isPresent)) {
      throw new ArgumentNotProvidedException('Missing property in room constructor');
    }

    if (!(props.id instanceof ID)) {
      throw new ArgumentInvalidException('Invalid id in room constructor');
    }

    if (!(props.center instanceof MapCoordinate)) {
      throw new ArgumentInvalidException('Invalid center in room constructor');
    }

    if (!Array.isArray(props.pixels)) {
      throw new ArgumentInvalidException('Invalid pixels in room constructor');
    }
  }
}
