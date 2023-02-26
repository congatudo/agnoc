import { expect } from 'chai';
import { describe, it } from 'mocha';
import { ArgumentOutOfRangeException } from '../exceptions/argument-out-of-range.exception';
import { interpolate } from './interpolate.util';

describe('interpolate.util', () => {
  it('returns interpolated value from positive range', () => {
    const from = {
      min: 50,
      max: 100,
    };
    const to = {
      min: 100,
      max: 150,
    };
    const ret = interpolate(60, from, to);

    expect(ret).to.be.equal(110);
  });

  it('returns interpolated value from negative range', () => {
    const from = {
      min: -100,
      max: -50,
    };
    const to = {
      min: -150,
      max: -100,
    };
    const ret = interpolate(-60, from, to);

    expect(ret).to.be.equal(-110);
  });

  it('returns interpolated value from mixed range', () => {
    const from = {
      min: -1000,
      max: -500,
    };
    const to = {
      min: 500,
      max: 1000,
    };
    const ret = interpolate(-600, from, to);

    expect(ret).to.be.equal(900);
  });

  it('throws an error when value is out of range', () => {
    const from = {
      min: 50,
      max: 100,
    };
    const to = {
      min: 100,
      max: 150,
    };
    expect(() => {
      interpolate(25, from, to);
    }).to.throw(ArgumentOutOfRangeException);
  });
});
