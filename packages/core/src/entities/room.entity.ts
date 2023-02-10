import { Entity } from '../base-classes/entity.base';
import { ArgumentInvalidException } from '../exceptions/argument-invalid.exception';
import { ArgumentNotProvidedException } from '../exceptions/argument-not-provided.exception';
import { isPresent } from '../utils/is-present.util';
import { Coordinate } from '../value-objects/coordinate.value-object';
import { ID } from '../value-objects/id.value-object';
import { Pixel } from '../value-objects/pixel.value-object';

export interface RoomProps {
  id: ID;
  name: string;
  isEnabled: boolean;
  center: Coordinate;
  pixels: Pixel[];
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

  get center(): Coordinate {
    return this.props.center;
  }

  get pixels(): Pixel[] {
    return this.props.pixels;
  }

  private validate(props: RoomProps): void {
    if (![props.id, props.name, props.isEnabled, props.center, props.pixels].every(isPresent)) {
      throw new ArgumentNotProvidedException('Missing property in room constructor');
    }

    if (!(props.id instanceof ID)) {
      throw new ArgumentInvalidException('Invalid id in room constructor');
    }

    if (!(props.center instanceof Coordinate)) {
      throw new ArgumentInvalidException('Invalid center in room constructor');
    }

    if (!Array.isArray(props.pixels)) {
      throw new ArgumentInvalidException('Invalid pixels in room constructor');
    }
  }
}
