import { Entity, isPresent, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
import { MapCoordinate } from '../value-objects/map-coordinate.value-object';
import { MapPixel } from '../value-objects/map-pixel.value-object';
import { MapPosition } from '../value-objects/map-position.value-object';
import { Room } from './room.entity';
import { Zone } from './zone.entity';
import type { EntityProps } from '@agnoc/toolkit';

/** Describes the properties of a map for the device. */
export interface DeviceMapProps extends EntityProps {
  /** The size of the map in pixels. */
  size: MapPixel;
  /** The minimum coordinate of the map. */
  min: MapCoordinate;
  /** The maximum coordinate of the map. */
  max: MapCoordinate;
  /** The resolution of the map. */
  resolution: number;
  /** The grid of the map. */
  grid: Buffer;
  /** The position of the robot. */
  robot?: MapPosition;
  /** The position of the charger. */
  charger?: MapPosition;
  /** The position of the current spot. */
  currentSpot?: MapPosition;
  /** The rooms in the map. */
  rooms: Room[];
  /** The restricted zones in the map. */
  restrictedZones: Zone[];
  /** The path of the robot. */
  robotPath: MapCoordinate[];
}

/** Describes a map for the device. */
export class DeviceMap extends Entity<DeviceMapProps> {
  /** Returns the size of the map in pixels. */
  get size(): MapPixel {
    return this.props.size;
  }

  /** Returns the minimum coordinate of the map. */
  get min(): MapCoordinate {
    return this.props.min;
  }

  /** Returns the maximum coordinate of the map. */
  get max(): MapCoordinate {
    return this.props.max;
  }

  /** Returns the resolution of the map. */
  get resolution(): number {
    return this.props.resolution;
  }

  /** Returns the grid of the map. */
  get grid(): Buffer {
    return this.props.grid;
  }

  /** Returns the position of the robot. */
  get robot(): MapPosition | undefined {
    return this.props.robot;
  }

  /** Returns the position of the charger. */
  get charger(): MapPosition | undefined {
    return this.props.charger;
  }

  /** Returns the rooms in the map. */
  get rooms(): Room[] {
    return this.props.rooms;
  }

  /** Returns the restricted zones in the map. */
  get restrictedZones(): Zone[] {
    return this.props.restrictedZones;
  }

  /** Returns the position of the current spot. */
  get currentSpot(): MapPosition | undefined {
    return this.props.currentSpot;
  }

  /** Returns the path of the robot. */
  get robotPath(): MapCoordinate[] {
    return this.props.robotPath;
  }

  /** Updates the position of the robot. */
  updateRobot(robot: MapPosition): void {
    this.props.robot = robot;
  }

  /** Updates the position of the charger. */
  updateCharger(charger: MapPosition): void {
    this.props.charger = charger;
  }

  /** Updates the restricted zones. */
  updateRestrictedZones(restrictedZones: Zone[]): void {
    this.props.restrictedZones = restrictedZones;
  }

  /** Updates the rooms. */
  updateRooms(rooms: Room[]): void {
    this.props.rooms = rooms;
  }

  /** Updates the position of the current spot. */
  updateCurrentSpot(currentSpot: MapPosition): void {
    this.props.currentSpot = currentSpot;
  }

  /** Updates the path of the robot. */
  updateRobotPath(robotPath: MapCoordinate[]): void {
    this.props.robotPath = robotPath;
  }

  /** Returns the pixel position of the given coordinate. */
  toPixel(pos: MapCoordinate): MapPixel {
    return new MapPixel({
      x: Math.floor(((pos.x - this.min.x) * this.size.x) / (this.max.x - this.min.x)),
      y: Math.floor(((pos.y - this.min.y) * this.size.y) / (this.max.y - this.min.y)),
    });
  }

  /** Returns the coordinate of the given pixel position. */
  toCoordinate(pos: MapPixel): MapCoordinate {
    return new MapCoordinate({
      x: (pos.x / this.size.x) * (this.max.x - this.min.x) + this.min.x,
      y: (pos.y / this.size.y) * (this.max.y - this.min.y) + this.min.y,
    });
  }

  protected validate(props: DeviceMapProps): void {
    const keys: (keyof DeviceMapProps)[] = [
      'size',
      'min',
      'max',
      'resolution',
      'grid',
      'rooms',
      'restrictedZones',
      'robotPath',
    ];

    keys.forEach((prop) => {
      const value = props[prop];

      if (!isPresent(value)) {
        throw new ArgumentNotProvidedException(`Property '${prop}' for ${this.constructor.name} not provided`);
      }
    });

    if (!(props.size instanceof MapPixel)) {
      throw new ArgumentInvalidException(
        `Value '${props.size as string}' for property 'size' for ${this.constructor.name} is not a ${MapPixel.name}`,
      );
    }

    if (!(props.min instanceof MapCoordinate)) {
      throw new ArgumentInvalidException(
        `Value '${props.min as string}' for property 'min' for ${this.constructor.name} is not a ${MapCoordinate.name}`,
      );
    }

    if (!(props.max instanceof MapCoordinate)) {
      throw new ArgumentInvalidException(
        `Value '${props.max as string}' for property 'max' for ${this.constructor.name} is not a ${MapCoordinate.name}`,
      );
    }

    if (typeof props.resolution !== 'number') {
      throw new ArgumentInvalidException(
        `Value '${props.resolution as string}' for property 'resolution' for ${this.constructor.name} is not a number`,
      );
    }

    if (!(props.grid instanceof Buffer)) {
      throw new ArgumentInvalidException(
        `Value '${props.grid as string}' for property 'grid' for ${this.constructor.name} is not a Buffer`,
      );
    }

    if (isPresent(props.robot) && !(props.robot instanceof MapPosition)) {
      throw new ArgumentInvalidException(
        `Value '${props.robot as string}' for property 'robot' for ${this.constructor.name} is not a ${
          MapPosition.name
        }`,
      );
    }

    if (isPresent(props.charger) && !(props.charger instanceof MapPosition)) {
      throw new ArgumentInvalidException(
        `Value '${props.charger as string}' for property 'charger' for ${this.constructor.name} is not a ${
          MapPosition.name
        }`,
      );
    }

    if (isPresent(props.currentSpot) && !(props.currentSpot instanceof MapPosition)) {
      throw new ArgumentInvalidException(
        `Value '${props.currentSpot as string}' for property 'currentSpot' for ${this.constructor.name} is not a ${
          MapPosition.name
        }`,
      );
    }

    if (!Array.isArray(props.rooms)) {
      throw new ArgumentInvalidException(
        `Value '${props.rooms as string}' for property 'rooms' for ${this.constructor.name} is not an array of ${
          Room.name
        }`,
      );
    }

    if (!props.rooms.every((room) => room instanceof Room)) {
      throw new ArgumentInvalidException(
        `Value '${props.rooms.join(', ')}' for property 'rooms' for ${this.constructor.name} is not an array of ${
          Room.name
        }`,
      );
    }

    if (!Array.isArray(props.restrictedZones)) {
      throw new ArgumentInvalidException(
        `Value '${props.restrictedZones as string}' for property 'restrictedZones' for ${
          this.constructor.name
        } is not an array of ${Zone.name}`,
      );
    }

    if (!props.restrictedZones.every((zone) => zone instanceof Zone)) {
      throw new ArgumentInvalidException(
        `Value '${props.restrictedZones.join(', ')}' for property 'restrictedZones' for ${
          this.constructor.name
        } is not an array of ${Zone.name}`,
      );
    }

    if (!Array.isArray(props.robotPath)) {
      throw new ArgumentInvalidException(
        `Value '${props.robotPath as string}' for property 'robotPath' for ${
          this.constructor.name
        } is not an array of ${MapCoordinate.name}`,
      );
    }
    if (!props.robotPath.every((coord) => coord instanceof MapCoordinate)) {
      throw new ArgumentInvalidException(
        `Value '${props.robotPath.join(', ')}' for property 'robotPath' for ${
          this.constructor.name
        } is not an array of ${MapCoordinate.name}`,
      );
    }
  }
}
