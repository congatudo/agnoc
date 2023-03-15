import { ValueObject, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { givenSomeMapPixelProps } from '../test-support';
import { MapPixel } from './map-pixel.value-object';

describe('MapPixel', function () {
  it('should be created', function () {
    const mapPixelProps = givenSomeMapPixelProps();
    const mapPixel = new MapPixel(mapPixelProps);

    expect(mapPixel).to.be.instanceOf(ValueObject);
    expect(mapPixel.x).to.be.equal(mapPixelProps.x);
    expect(mapPixel.y).to.be.equal(mapPixelProps.y);
  });

  it("should throw an error when 'x' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new MapPixel({ ...givenSomeMapPixelProps(), x: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'x' for MapPixel not provided`,
    );
  });

  it("should throw an error when 'x' property is negative", function () {
    expect(() => new MapPixel({ ...givenSomeMapPixelProps(), x: -5 })).to.throw(
      ArgumentInvalidException,
      `Value '-5' for property 'x' of MapPixel is not a positive integer`,
    );
  });

  it("should throw an error when 'x' property is not integer", function () {
    expect(() => new MapPixel({ ...givenSomeMapPixelProps(), x: 0.5 })).to.throw(
      ArgumentInvalidException,
      `Value '0.5' for property 'x' of MapPixel is not a positive integer`,
    );
  });

  it("should throw an error when 'y' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new MapPixel({ ...givenSomeMapPixelProps(), y: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'y' for MapPixel not provided`,
    );
  });

  it("should throw an error when 'y' property is negative", function () {
    expect(() => new MapPixel({ ...givenSomeMapPixelProps(), y: -5 })).to.throw(
      ArgumentInvalidException,
      `Value '-5' for property 'y' of MapPixel is not a positive integer`,
    );
  });

  it("should throw an error when 'y' property is not integer", function () {
    expect(() => new MapPixel({ ...givenSomeMapPixelProps(), y: 0.5 })).to.throw(
      ArgumentInvalidException,
      `Value '0.5' for property 'y' of MapPixel is not a positive integer`,
    );
  });
});
