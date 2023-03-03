import { ArgumentInvalidException, ArgumentNotProvidedException, Entity } from '@agnoc/toolkit';
import { expect } from 'chai';
import {
  givenSomeDeviceMapProps,
  givenSomeMapCoordinateProps,
  givenSomeMapPositionProps,
  givenSomeRoomProps,
  givenSomeZoneProps,
} from '../test-support';
import { MapCoordinate } from '../value-objects/map-coordinate.value-object';
import { MapPixel } from '../value-objects/map-pixel.value-object';
import { MapPosition } from '../value-objects/map-position.value-object';
import { DeviceMap } from './device-map.entity';
import { Room } from './room.entity';
import { Zone } from './zone.entity';

describe('DeviceMap', function () {
  it('should be created', function () {
    const deviceMapProps = givenSomeDeviceMapProps();
    const deviceMap = new DeviceMap(deviceMapProps);

    expect(deviceMap).to.be.instanceOf(Entity);
    expect(deviceMap.id).to.be.equal(deviceMapProps.id);
    expect(deviceMap.size).to.be.equal(deviceMapProps.size);
    expect(deviceMap.min).to.be.equal(deviceMapProps.min);
    expect(deviceMap.max).to.be.equal(deviceMapProps.max);
    expect(deviceMap.resolution).to.be.equal(deviceMapProps.resolution);
    expect(deviceMap.grid).to.be.equal(deviceMapProps.grid);
    expect(deviceMap.robot).to.be.undefined;
    expect(deviceMap.charger).to.be.undefined;
    expect(deviceMap.currentSpot).to.be.undefined;
    expect(deviceMap.rooms).to.be.equal(deviceMapProps.rooms);
    expect(deviceMap.restrictedZones).to.be.equal(deviceMapProps.restrictedZones);
    expect(deviceMap.robotPath).to.be.equal(deviceMapProps.robotPath);
  });

  it('should be created without optionals', function () {
    const deviceMapProps = {
      ...givenSomeDeviceMapProps(),
      robot: new MapPosition(givenSomeMapPositionProps()),
      charger: new MapPosition(givenSomeMapPositionProps()),
      currentSpot: new MapPosition(givenSomeMapPositionProps()),
    };
    const deviceMap = new DeviceMap(deviceMapProps);

    expect(deviceMap.robot).to.be.equal(deviceMapProps.robot);
    expect(deviceMap.charger).to.be.equal(deviceMapProps.charger);
    expect(deviceMap.currentSpot).to.be.equal(deviceMapProps.currentSpot);
  });

  it("should throw an error when 'size' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), size: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'size' for DeviceMap not provided`,
    );
  });

  it("should throw an error when 'min' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), min: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'min' for DeviceMap not provided`,
    );
  });

  it("should throw an error when 'max' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), max: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'max' for DeviceMap not provided`,
    );
  });

  it("should throw an error when 'resolution' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), resolution: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'resolution' for DeviceMap not provided`,
    );
  });

  it("should throw an error when 'grid' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), grid: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'grid' for DeviceMap not provided`,
    );
  });

  it("should throw an error when 'rooms' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), rooms: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'rooms' for DeviceMap not provided`,
    );
  });

  it("should throw an error when 'restrictedZones' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), restrictedZones: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'restrictedZones' for DeviceMap not provided`,
    );
  });

  it("should throw an error when 'robotPath' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), robotPath: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'robotPath' for DeviceMap not provided`,
    );
  });

  it("should throw an error when 'size' is not a MapPixel", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), size: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'size' of DeviceMap is not an instance of MapPixel`,
    );
  });

  it("should throw an error when 'min' is not a MapCoordinate", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), min: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'min' of DeviceMap is not an instance of MapCoordinate`,
    );
  });

  it("should throw an error when 'max' is not a MapCoordinate", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), max: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'max' of DeviceMap is not an instance of MapCoordinate`,
    );
  });

  it("should throw an error when 'resolution' is not a number", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), resolution: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'resolution' of DeviceMap is not a number`,
    );
  });

  it("should throw an error when 'grid' is not a Buffer", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), grid: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'grid' of DeviceMap is not an instance of Buffer`,
    );
  });

  it("should throw an error when 'robot' is provided but is not a MapPosition", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), robot: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'robot' of DeviceMap is not an instance of MapPosition`,
    );
  });

  it("should throw an error when 'charger' is provided but is not a MapPosition", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), charger: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'charger' of DeviceMap is not an instance of MapPosition`,
    );
  });

  it("should throw an error when 'currentSpot' is provided but is not a MapPosition", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), currentSpot: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'currentSpot' of DeviceMap is not an instance of MapPosition`,
    );
  });

  it("should throw an error when 'rooms' is not an array", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), rooms: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'rooms' of DeviceMap is not an array`,
    );
  });

  it("should throw an error when 'rooms' is not an array of Room", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), rooms: ['foo', 1] })).to.throw(
      ArgumentInvalidException,
      `Value 'foo, 1' for property 'rooms' of DeviceMap is not an array of Room`,
    );
  });

  it("should throw an error when 'restrictedZones' is not an array", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), restrictedZones: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'restrictedZones' of DeviceMap is not an array`,
    );
  });

  it("should throw an error when 'restrictedZones' is not an array of Zone", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), restrictedZones: ['foo', 1] })).to.throw(
      ArgumentInvalidException,
      `Value 'foo, 1' for property 'restrictedZones' of DeviceMap is not an array of Zone`,
    );
  });

  it("should throw an error when 'robotPath' is not an array", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), robotPath: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'robotPath' of DeviceMap is not an array`,
    );
  });

  it("should throw an error when 'robotPath' is not an array of MapCoordinate", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), robotPath: ['foo', 1] })).to.throw(
      ArgumentInvalidException,
      `Value 'foo, 1' for property 'robotPath' of DeviceMap is not an array of MapCoordinate`,
    );
  });

  describe('#updateRobot()', function () {
    it('should update the robot position', function () {
      const map = new DeviceMap(givenSomeDeviceMapProps());
      const position = new MapPosition(givenSomeMapPositionProps());

      map.updateRobot(position);

      expect(map.robot).to.be.equal(position);
    });
  });

  describe('#updateCharger()', function () {
    it('should update the charger position', function () {
      const map = new DeviceMap(givenSomeDeviceMapProps());
      const position = new MapPosition(givenSomeMapPositionProps());

      map.updateCharger(position);

      expect(map.charger).to.be.equal(position);
    });
  });

  describe('#updateRestrictedZones()', function () {
    it('should update the restricted zones', function () {
      const map = new DeviceMap(givenSomeDeviceMapProps());
      const zones = [new Zone(givenSomeZoneProps())];

      map.updateRestrictedZones(zones);

      expect(map.restrictedZones).to.be.equal(zones);
    });
  });

  describe('#updateRooms()', function () {
    it('should update the rooms', function () {
      const map = new DeviceMap(givenSomeDeviceMapProps());
      const rooms = [new Room(givenSomeRoomProps())];

      map.updateRooms(rooms);

      expect(map.rooms).to.be.equal(rooms);
    });
  });

  describe('#updateCurrentSpot()', function () {
    it('should update the current spot', function () {
      const map = new DeviceMap(givenSomeDeviceMapProps());
      const position = new MapPosition(givenSomeMapPositionProps());

      map.updateCurrentSpot(position);

      expect(map.currentSpot).to.be.equal(position);
    });
  });

  describe('#updateRobotPath()', function () {
    it('should update the robot path', function () {
      const map = new DeviceMap(givenSomeDeviceMapProps());
      const coordinates = [new MapCoordinate(givenSomeMapCoordinateProps())];

      map.updateRobotPath(coordinates);

      expect(map.robotPath).to.be.equal(coordinates);
    });
  });

  describe('#toPixel()', function () {
    it('should return the pixel coordinates', function () {
      const size = new MapPixel({ x: 100, y: 100 });
      const min = new MapCoordinate({ x: -20, y: -20 });
      const max = new MapCoordinate({ x: 20, y: 20 });
      const map = new DeviceMap({ ...givenSomeDeviceMapProps(), size, min, max });
      const pixel = map.toPixel(new MapCoordinate({ x: 10, y: -10 }));

      expect(pixel.x).to.be.equal(75);
      expect(pixel.y).to.be.equal(25);
    });
  });

  describe('#toCoordinate()', function () {
    it('should return the pixel coordinates', function () {
      const size = new MapPixel({ x: 100, y: 100 });
      const min = new MapCoordinate({ x: -20, y: -20 });
      const max = new MapCoordinate({ x: 20, y: 20 });
      const map = new DeviceMap({ ...givenSomeDeviceMapProps(), size, min, max });
      const coordinate = map.toCoordinate(new MapPixel({ x: 75, y: 25 }));

      expect(coordinate.x).to.be.equal(10);
      expect(coordinate.y).to.be.equal(-10);
    });
  });
});
