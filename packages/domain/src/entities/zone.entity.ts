import { ID, Entity, isPresent, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
import { Coordinate } from '../value-objects/coordinate.value-object';

export interface ZoneProps {
  id: ID;
  coordinates: Coordinate[];
}

export class Zone extends Entity<ZoneProps> {
  constructor(props: ZoneProps) {
    super(props);
    this.validate(props);
  }

  override get id(): ID {
    return this.props.id;
  }

  get coordinates(): Coordinate[] {
    return this.props.coordinates;
  }

  private validate(props: ZoneProps): void {
    if (![props.id, props.coordinates].every(isPresent)) {
      throw new ArgumentNotProvidedException('Missing property in zone constructor');
    }

    if (!(props.id instanceof ID)) {
      throw new ArgumentInvalidException('Invalid id in zone constructor');
    }

    if (!Array.isArray(props.coordinates)) {
      throw new ArgumentInvalidException('Invalid coordinate in zone constructor');
    }
  }
}
