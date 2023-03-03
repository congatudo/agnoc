import { Entity } from '@agnoc/toolkit';
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
    this.validateDefinedProp(props, 'coordinates');
    this.validateArrayProp(props, 'coordinates', MapCoordinate);
  }
}
