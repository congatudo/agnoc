import { ValueObject, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { givenSomeMapCoordinateProps } from '../test-support';
import { MapCoordinate } from './map-coordinate.value-object';

describe('MapCoordinate', function () {
  it('should be created', function () {
    const mapCoordinateProps = givenSomeMapCoordinateProps();
    const mapCoordinate = new MapCoordinate(mapCoordinateProps);

    expect(mapCoordinate).to.be.instanceOf(ValueObject);
    expect(mapCoordinate.x).to.be.equal(mapCoordinateProps.x);
    expect(mapCoordinate.y).to.be.equal(mapCoordinateProps.y);
  });

  it("should throw an error when 'x' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new MapCoordinate({ ...givenSomeMapCoordinateProps(), x: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'x' for MapCoordinate not provided`,
    );
  });

  it("should throw an error when 'x' property is invalid", function () {
    // @ts-expect-error - missing property
    expect(() => new MapCoordinate({ ...givenSomeMapCoordinateProps(), x: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' of property 'x' for MapCoordinate is not a number`,
    );
  });

  it("should throw an error when 'y' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new MapCoordinate({ ...givenSomeMapCoordinateProps(), y: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'y' for MapCoordinate not provided`,
    );
  });

  it("should throw an error when 'y' property is invalid", function () {
    // @ts-expect-error - missing property
    expect(() => new MapCoordinate({ ...givenSomeMapCoordinateProps(), y: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' of property 'y' for MapCoordinate is not a number`,
    );
  });
});
