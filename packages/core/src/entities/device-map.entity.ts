import { Entity } from "../base-classes/entity.base";
import { ArgumentInvalidException } from "../exceptions/argument-invalid.exception";
import { ArgumentNotProvidedException } from "../exceptions/argument-not-provided.exception";
import { isPresent } from "../utils/is-present.util";
import { Coordinate } from "../value-objects/coordinate.value-object";
import { ID } from "../value-objects/id.value-object";
import { Position } from "../value-objects/position.value-object";
import { Room } from "./room.entity";
import { Zone } from "./zone.entity";

export interface DeviceMapProps {
  id: ID;
  size: Coordinate;
  min: Coordinate;
  max: Coordinate;
  grid: Buffer;
  robot?: Position;
  charger?: Position;
  currentSpot?: Position;
  rooms: Room[];
  restrictedZones: Zone[];
}

export class DeviceMap extends Entity<DeviceMapProps> {
  constructor(props: DeviceMapProps) {
    super(props);
    this.validate(props);
  }

  get id(): ID {
    return this.props.id;
  }

  get size(): Coordinate {
    return this.props.size;
  }

  get min(): Coordinate {
    return this.props.min;
  }

  get max(): Coordinate {
    return this.props.max;
  }

  get grid(): Buffer {
    return this.props.grid;
  }

  get robot(): Position | undefined {
    return this.props.robot;
  }

  get charger(): Position | undefined {
    return this.props.charger;
  }

  get rooms(): Room[] {
    return this.props.rooms;
  }

  get restrictedZones(): Zone[] {
    return this.props.restrictedZones;
  }

  get currentSpot(): Position | undefined {
    return this.props.currentSpot;
  }

  updateRobot(robot: Position): void {
    this.props.robot = robot;
  }

  updateCharger(charger: Position): void {
    this.props.charger = charger;
  }

  getRelativeCoordinate(pos: Coordinate): Coordinate {
    return new Coordinate({
      x: Math.floor(
        ((pos.x - this.min.x) * this.size.x) / (this.max.x - this.min.x)
      ),
      y: Math.floor(
        ((pos.y - this.min.y) * this.size.y) / (this.max.y - this.min.y)
      ),
    });
  }

  getAbsoluteCoordinate(pos: Coordinate): Coordinate {
    return new Coordinate({
      x: (pos.x / this.size.x) * (this.max.x - this.min.x) + this.min.x,
      y: (pos.y / this.size.y) * (this.max.y - this.min.y) + this.min.y,
    });
  }

  private validate(props: DeviceMapProps): void {
    if (
      ![
        props.id,
        props.size,
        props.min,
        props.max,
        props.grid,
        props.rooms,
        props.restrictedZones,
      ].every(isPresent)
    ) {
      throw new ArgumentNotProvidedException(
        "Missing property in device map constructor"
      );
    }

    if (!(props.id instanceof ID)) {
      throw new ArgumentInvalidException(
        "Invalid id in device map constructor"
      );
    }

    if (!Array.isArray(props.rooms)) {
      throw new ArgumentInvalidException(
        "Invalid rooms in device map constructor"
      );
    }

    if (!Array.isArray(props.restrictedZones)) {
      throw new ArgumentInvalidException(
        "Invalid restricted zones in device map constructor"
      );
    }
  }
}
