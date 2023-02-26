import { Entity, isPresent, ArgumentNotProvidedException, ArgumentInvalidException, ID } from '@agnoc/toolkit';
import { MapCoordinate } from '../value-objects/map-coordinate.value-object';
import { MapPixel } from '../value-objects/map-pixel.value-object';
import type { Room } from './room.entity';
import type { Zone } from './zone.entity';
import type { MapPosition } from '../value-objects/map-position.value-object';

export interface DeviceMapProps {
  id: ID;
  size: MapPixel;
  min: MapCoordinate;
  max: MapCoordinate;
  resolution: number;
  grid: Buffer;
  robot?: MapPosition;
  charger?: MapPosition;
  currentSpot?: MapPosition;
  rooms: Room[];
  restrictedZones: Zone[];
  robotPath: MapCoordinate[];
}

export class DeviceMap extends Entity<DeviceMapProps> {
  constructor(props: DeviceMapProps) {
    super(props);
    this.validate(props);
  }

  override get id(): ID {
    return this.props.id;
  }

  get size(): MapPixel {
    return this.props.size;
  }

  get min(): MapCoordinate {
    return this.props.min;
  }

  get max(): MapCoordinate {
    return this.props.max;
  }

  get resolution(): number {
    return this.props.resolution;
  }

  get grid(): Buffer {
    return this.props.grid;
  }

  get robot(): MapPosition | undefined {
    return this.props.robot;
  }

  get charger(): MapPosition | undefined {
    return this.props.charger;
  }

  get rooms(): Room[] {
    return this.props.rooms;
  }

  get restrictedZones(): Zone[] {
    return this.props.restrictedZones;
  }

  get currentSpot(): MapPosition | undefined {
    return this.props.currentSpot;
  }

  get robotPath(): MapCoordinate[] {
    return this.props.robotPath;
  }

  updateRobot(robot: MapPosition): void {
    this.props.robot = robot;
  }

  updateCharger(charger: MapPosition): void {
    this.props.charger = charger;
  }

  updateRestrictedZones(restrictedZones: Zone[]): void {
    this.props.restrictedZones = restrictedZones;
  }

  updateRooms(rooms: Room[]): void {
    this.props.rooms = rooms;
  }

  updateCurrentSpot(currentSpot: MapPosition): void {
    this.props.currentSpot = currentSpot;
  }

  updateRobotPath(robotPath: MapCoordinate[]): void {
    this.props.robotPath = robotPath;
  }

  toPixel(pos: MapCoordinate): MapPixel {
    return new MapPixel({
      x: Math.floor(((pos.x - this.min.x) * this.size.x) / (this.max.x - this.min.x)),
      y: Math.floor(((pos.y - this.min.y) * this.size.y) / (this.max.y - this.min.y)),
    });
  }

  toCoordinate(pos: MapPixel): MapCoordinate {
    return new MapCoordinate({
      x: (pos.x / this.size.x) * (this.max.x - this.min.x) + this.min.x,
      y: (pos.y / this.size.y) * (this.max.y - this.min.y) + this.min.y,
    });
  }

  private validate(props: DeviceMapProps): void {
    if (
      ![props.id, props.size, props.min, props.max, props.grid, props.rooms, props.restrictedZones].every(isPresent)
    ) {
      throw new ArgumentNotProvidedException('Missing property in device map constructor');
    }

    if (!(props.id instanceof ID)) {
      throw new ArgumentInvalidException('Invalid id in device map constructor');
    }

    if (!Array.isArray(props.rooms)) {
      throw new ArgumentInvalidException('Invalid rooms in device map constructor');
    }

    if (!Array.isArray(props.restrictedZones)) {
      throw new ArgumentInvalidException('Invalid restricted zones in device map constructor');
    }
  }
}
