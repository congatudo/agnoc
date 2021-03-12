import { ValueObject } from "../base-classes/value-object.base";
import { ArgumentInvalidException } from "../exceptions/argument-invalid.exception";
import { ArgumentNotProvidedException } from "../exceptions/argument-not-provided.exception";
import { isPresent } from "../utils/is-present.util";
import { Coordinate } from "./coordinate.value-object";

export interface PositionProps {
  x: number;
  y: number;
  phi: number;
}

export class Position extends ValueObject<PositionProps> {
  get x(): number {
    return this.props.x;
  }

  get y(): number {
    return this.props.y;
  }

  get phi(): number {
    return this.props.phi;
  }

  get degrees(): number {
    return ((this.phi + Math.PI) * 180.0) / Math.PI - 90.0;
  }

  toCoordinates(): Coordinate {
    return new Coordinate({ x: this.x, y: this.y });
  }

  protected validate(props: PositionProps): void {
    if (![props.x, props.y, props.phi].map(isPresent)) {
      throw new ArgumentNotProvidedException(
        "Missing property in position constructor"
      );
    }

    if (props.phi < -1 * Math.PI || props.phi > Math.PI) {
      throw new ArgumentInvalidException(
        "Invalid property phi in position constructor"
      );
    }
  }
}
