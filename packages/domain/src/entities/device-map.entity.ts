import { Entity } from '@agnoc/toolkit';
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
    this.validateDefinedProp({ robot }, 'robot');
    this.validateInstanceProp({ robot }, 'robot', MapPosition);
    this.props.robot = robot;
  }

  /** Updates the position of the charger. */
  updateCharger(charger: MapPosition): void {
    this.validateDefinedProp({ charger }, 'charger');
    this.validateInstanceProp({ charger }, 'charger', MapPosition);
    this.props.charger = charger;
  }

  /** Updates the restricted zones. */
  updateRestrictedZones(restrictedZones: Zone[]): void {
    this.validateDefinedProp({ restrictedZones }, 'restrictedZones');
    this.validateArrayProp({ restrictedZones }, 'restrictedZones', Zone);
    this.props.restrictedZones = restrictedZones;
  }

  /** Updates the rooms. */
  updateRooms(rooms: Room[]): void {
    this.validateDefinedProp({ rooms }, 'rooms');
    this.validateArrayProp({ rooms }, 'rooms', Room);
    this.props.rooms = rooms;
  }

  /** Updates the position of the current spot. */
  updateCurrentSpot(currentSpot: MapPosition): void {
    this.validateDefinedProp({ currentSpot }, 'currentSpot');
    this.validateInstanceProp({ currentSpot }, 'currentSpot', MapPosition);
    this.props.currentSpot = currentSpot;
  }

  /** Updates the path of the robot. */
  updateRobotPath(robotPath: MapCoordinate[]): void {
    this.validateDefinedProp({ robotPath }, 'robotPath');
    this.validateArrayProp({ robotPath }, 'robotPath', MapCoordinate);
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
      this.validateDefinedProp(props, prop);
    });

    this.validateInstanceProp(props, 'size', MapPixel);
    this.validateInstanceProp(props, 'min', MapCoordinate);
    this.validateInstanceProp(props, 'max', MapCoordinate);
    this.validateNumberProp(props, 'resolution');
    this.validateInstanceProp(props, 'grid', Buffer);
    this.validateInstanceProp(props, 'robot', MapPosition);
    this.validateInstanceProp(props, 'charger', MapPosition);
    this.validateInstanceProp(props, 'currentSpot', MapPosition);
    this.validateArrayProp(props, 'rooms', Room);
    this.validateArrayProp(props, 'restrictedZones', Zone);
    this.validateArrayProp(props, 'robotPath', MapCoordinate);
  }
}
