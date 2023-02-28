import { ArgumentNotProvidedException, ArgumentInvalidException, ID, Entity } from '@agnoc/toolkit';
import { expect } from 'chai';
import { MapCoordinate } from '../value-objects/map-coordinate.value-object';
import { Zone } from './zone.entity';

describe('Zone', function () {
  let id: ID;
  let coordinates: MapCoordinate[];

  beforeEach(function () {
    id = new ID(1);
    coordinates = [
      new MapCoordinate({ x: 1, y: 1 }),
      new MapCoordinate({ x: 1, y: 2 }),
      new MapCoordinate({ x: 1, y: 3 }),
    ];
  });

  it('should be created', function () {
    const zone = new Zone({ id, coordinates });

    expect(zone).to.be.instanceOf(Entity);
    expect(zone.id).to.be.equal(id);
    expect(zone.coordinates).to.be.deep.equal(coordinates);
  });

  it("should throw an error when 'coordinates' are not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new Zone({ id })).to.throw(
      ArgumentNotProvidedException,
      `Property 'coordinates' for zone not provided`,
    );
  });

  it("should throw an error when 'coordinates' is not an array", function () {
    // @ts-expect-error - invalid property
    expect(() => new Zone({ id, coordinates: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Property 'coordinates' for zone must be an array`,
    );
  });

  it("should throw an error when 'coordinates' are invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new Zone({ id, coordinates: ['foo', 1, null] })).to.throw(
      ArgumentInvalidException,
      `Property 'coordinates' for zone must be an array of MapCoordinate`,
    );
  });
});
