import { ValueObject, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { MapCoordinate } from './map-coordinate.value-object';
import { MapPosition } from './map-position.value-object';

describe('MapPosition', function () {
  it('should be created', function () {
    const mapPosition = new MapPosition({ x: 10, y: 20, phi: 0 });

    expect(mapPosition).to.be.instanceOf(ValueObject);
    expect(mapPosition.x).to.be.equal(10);
    expect(mapPosition.y).to.be.equal(20);
    expect(mapPosition.phi).to.be.equal(0);
    expect(mapPosition.degrees).to.be.equal(90);
  });

  it("should throw an error when 'x' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new MapPosition({ y: 20, phi: 0 })).to.throw(
      ArgumentNotProvidedException,
      `Property 'x' for MapPosition not provided`,
    );
  });

  it("should throw an error when 'x' property is invalid", function () {
    // @ts-expect-error - missing property
    expect(() => new MapPosition({ x: 'foo', y: 20, phi: 0 })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' of property 'x' for MapPosition is not a number`,
    );
  });

  it("should throw an error when 'y' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new MapPosition({ x: 10, phi: 0 })).to.throw(
      ArgumentNotProvidedException,
      `Property 'y' for MapPosition not provided`,
    );
  });

  it("should throw an error when 'y' property is invalid", function () {
    // @ts-expect-error - missing property
    expect(() => new MapPosition({ x: 10, y: 'foo', phi: 0 })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' of property 'y' for MapPosition is not a number`,
    );
  });

  it("should throw an error when 'phi' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new MapPosition({ x: 10, y: 20 })).to.throw(
      ArgumentNotProvidedException,
      `Property 'phi' for MapPosition not provided`,
    );
  });

  it("should throw an error when 'phi' property is invalid", function () {
    // @ts-expect-error - missing property
    expect(() => new MapPosition({ x: 10, y: 20, phi: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' of property 'phi' for MapPosition is not a number`,
    );
  });

  describe('#toCoordinates', function () {
    it('should return the coordinates', function () {
      const mapPosition = new MapPosition({ x: 10, y: 20, phi: 0 });

      expect(mapPosition.toCoordinates().equals(new MapCoordinate({ x: 10, y: 20 }))).to.be.true;
    });
  });
});
