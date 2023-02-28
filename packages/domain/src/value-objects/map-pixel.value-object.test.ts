import { ValueObject, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { MapPixel } from './map-pixel.value-object';

describe('MapPixel', function () {
  it('should be created', function () {
    const mapPixel = new MapPixel({ x: 10, y: 20 });

    expect(mapPixel).to.be.instanceOf(ValueObject);
    expect(mapPixel.x).to.be.equal(10);
    expect(mapPixel.y).to.be.equal(20);
  });

  it("should throw an error when 'x' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new MapPixel({ y: 20 })).to.throw(
      ArgumentNotProvidedException,
      `Property 'x' for MapPixel not provided`,
    );
  });

  it("should throw an error when 'x' property is negative", function () {
    expect(() => new MapPixel({ x: -5, y: 20 })).to.throw(
      ArgumentInvalidException,
      `Value '-5' for property 'x' for MapPixel is not a positive integer`,
    );
  });

  it("should throw an error when 'x' property is not integer", function () {
    expect(() => new MapPixel({ x: 0.5, y: 20 })).to.throw(
      ArgumentInvalidException,
      `Value '0.5' for property 'x' for MapPixel is not a positive integer`,
    );
  });

  it("should throw an error when 'y' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new MapPixel({ x: 10 })).to.throw(
      ArgumentNotProvidedException,
      `Property 'y' for MapPixel not provided`,
    );
  });

  it("should throw an error when 'y' property is negative", function () {
    expect(() => new MapPixel({ x: 1, y: -5 })).to.throw(
      ArgumentInvalidException,
      `Value '-5' for property 'y' for MapPixel is not a positive integer`,
    );
  });

  it("should throw an error when 'y' property is not integer", function () {
    expect(() => new MapPixel({ x: 1, y: 0.5 })).to.throw(
      ArgumentInvalidException,
      `Value '0.5' for property 'y' for MapPixel is not a positive integer`,
    );
  });
});
