import { Entity } from "../base-classes/entity.base";
import { ArgumentInvalidException } from "../exceptions/argument-invalid.exception";
import { ArgumentNotProvidedException } from "../exceptions/argument-not-provided.exception";
import { isPresent } from "../utils/is-present.util";
import { Coordinate } from "../value-objects/coordinate.value-object";
import { ID } from "../value-objects/id.value-object";

export interface ZoneProps {
  id: ID;
  coordinates: Coordinate[];
}

export class Zone extends Entity<ZoneProps> {
  constructor(props: ZoneProps) {
    super(props);
    this.validate(props);
  }

  get id(): ID {
    return this.props.id;
  }

  get coordinates(): Coordinate[] {
    return this.props.coordinates;
  }

  private validate(props: ZoneProps): void {
    if (![props.id, props.coordinates].every(isPresent)) {
      throw new ArgumentNotProvidedException(
        "Missing property in zone constructor"
      );
    }

    if (!(props.id instanceof ID)) {
      throw new ArgumentInvalidException("Invalid id in zone constructor");
    }

    if (!Array.isArray(props.coordinates)) {
      throw new ArgumentInvalidException(
        "Invalid coordinate in zone constructor"
      );
    }
  }
}
