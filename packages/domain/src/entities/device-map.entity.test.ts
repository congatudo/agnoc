import { ArgumentInvalidException, ArgumentNotProvidedException, Entity } from '@agnoc/toolkit';
import { expect } from 'chai';
import { givenSomeDeviceMapProps, givenSomeMapPositionProps } from '../test-support';
import { MapPosition } from '../value-objects/map-position.value-object';
import { DeviceMap } from './device-map.entity';

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
      `Property 'size' for DeviceMap is not a MapPixel`,
    );
  });

  it("should throw an error when 'min' is not a MapCoordinate", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), min: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Property 'min' for DeviceMap is not a MapCoordinate`,
    );
  });

  it("should throw an error when 'max' is not a MapCoordinate", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), max: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Property 'max' for DeviceMap is not a MapCoordinate`,
    );
  });

  it("should throw an error when 'resolution' is not a number", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), resolution: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Property 'resolution' for DeviceMap is not a number`,
    );
  });

  it("should throw an error when 'grid' is not a Buffer", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), grid: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Property 'grid' for DeviceMap is not a Buffer`,
    );
  });

  it("should throw an error when 'robot' is provided but is not a MapPosition", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), robot: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Property 'robot' for DeviceMap is not a MapPosition`,
    );
  });

  it("should throw an error when 'charger' is provided but is not a MapPosition", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), charger: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Property 'charger' for DeviceMap is not a MapPosition`,
    );
  });

  it("should throw an error when 'currentSpot' is provided but is not a MapPosition", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), currentSpot: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Property 'currentSpot' for DeviceMap is not a MapPosition`,
    );
  });

  it("should throw an error when 'rooms' is not an array", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), rooms: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Property 'rooms' for DeviceMap is not an array`,
    );
  });

  it("should throw an error when 'rooms' is not an array of Room", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), rooms: ['foo'] })).to.throw(
      ArgumentInvalidException,
      `Property 'rooms' for DeviceMap is not an array of Room`,
    );
  });

  it("should throw an error when 'restrictedZones' is not an array", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), restrictedZones: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Property 'restrictedZones' for DeviceMap is not an array`,
    );
  });

  it("should throw an error when 'restrictedZones' is not an array of Zone", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), restrictedZones: ['foo'] })).to.throw(
      ArgumentInvalidException,
      `Property 'restrictedZones' for DeviceMap is not an array of Zone`,
    );
  });

  it("should throw an error when 'robotPath' is not an array", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), robotPath: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Property 'robotPath' for DeviceMap is not an array`,
    );
  });

  it("should throw an error when 'robotPath' is not an array of MapCoordinate", function () {
    // @ts-expect-error - invalid property
    expect(() => new DeviceMap({ ...givenSomeDeviceMapProps(), robotPath: ['foo'] })).to.throw(
      ArgumentInvalidException,
      `Property 'robotPath' for DeviceMap is not an array of MapCoordinate`,
    );
  });
});
