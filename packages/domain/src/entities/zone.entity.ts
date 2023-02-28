import { Entity, isPresent, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
import { MapCoordinate } from '../value-objects/map-coordinate.value-object';
import type { EntityProps } from '@agnoc/toolkit';

/** Describes the zone properties. */
export interface ZoneProps extends EntityProps {
  /** The zone coordinates. */
  coordinates: MapCoordinate[];
}

/** Describes a zone. */
export class Zone extends Entity<ZoneProps> {
  /** Returns the zone coordinates. */
  get coordinates(): MapCoordinate[] {
    return this.props.coordinates;
  }

  protected override validate(props: ZoneProps): void {
    if (!isPresent(props.coordinates)) {
      throw new ArgumentNotProvidedException(`Property 'coordinates' for zone not provided`);
    }

    if (!Array.isArray(props.coordinates)) {
      throw new ArgumentInvalidException(`Property 'coordinates' for zone must be an array`);
    }

    if (!props.coordinates.every((coordinate) => coordinate instanceof MapCoordinate)) {
      throw new ArgumentInvalidException(`Property 'coordinates' for zone must be an array of MapCoordinate`);
    }
  }
}
