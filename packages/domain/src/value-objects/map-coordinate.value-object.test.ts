import { ValueObject, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { MapCoordinate } from './map-coordinate.value-object';

describe('MapCoordinate', function () {
  it('should be created', function () {
    const mapCoordinate = new MapCoordinate({ x: 10, y: 20 });

    expect(mapCoordinate).to.be.instanceOf(ValueObject);
    expect(mapCoordinate.x).to.be.equal(10);
    expect(mapCoordinate.y).to.be.equal(20);
  });

  it("should throw an error when 'x' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new MapCoordinate({ y: 20 })).to.throw(
      ArgumentNotProvidedException,
      `Property 'x' for MapCoordinate not provided`,
    );
  });

  it("should throw an error when 'x' property is invalid", function () {
    // @ts-expect-error - missing property
    expect(() => new MapCoordinate({ x: 'foo', y: 20 })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' of property 'x' for MapCoordinate is not a number`,
    );
  });

  it("should throw an error when 'y' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new MapCoordinate({ x: 10 })).to.throw(
      ArgumentNotProvidedException,
      `Property 'y' for MapCoordinate not provided`,
    );
  });

  it("should throw an error when 'y' property is invalid", function () {
    // @ts-expect-error - missing property
    expect(() => new MapCoordinate({ x: 10, y: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' of property 'y' for MapCoordinate is not a number`,
    );
  });
});
