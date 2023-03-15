import { ArgumentNotProvidedException, ArgumentInvalidException, Entity } from '@agnoc/toolkit';
import { expect } from 'chai';
import { givenSomeZoneProps } from '../test-support';
import { Zone } from './zone.entity';

describe('Zone', function () {
  it('should be created', function () {
    const zoneProps = givenSomeZoneProps();
    const zone = new Zone(zoneProps);

    expect(zone).to.be.instanceOf(Entity);
    expect(zone.id).to.be.equal(zoneProps.id);
    expect(zone.coordinates).to.be.deep.equal(zoneProps.coordinates);
  });

  it("should throw an error when 'coordinates' are not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new Zone({ ...givenSomeZoneProps(), coordinates: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'coordinates' for Zone not provided`,
    );
  });

  it("should throw an error when 'coordinates' is not an array", function () {
    // @ts-expect-error - invalid property
    expect(() => new Zone({ ...givenSomeZoneProps(), coordinates: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'coordinates' of Zone is not an array`,
    );
  });

  it("should throw an error when 'coordinates' are invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new Zone({ ...givenSomeZoneProps(), coordinates: ['foo', 1] })).to.throw(
      ArgumentInvalidException,
      `Value 'foo, 1' for property 'coordinates' of Zone is not an array of MapCoordinate`,
    );
  });
});
