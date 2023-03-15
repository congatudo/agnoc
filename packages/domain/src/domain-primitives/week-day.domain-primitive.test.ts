import { ArgumentInvalidException, DomainPrimitive } from '@agnoc/toolkit';
import { expect } from 'chai';
import { WeekDay, WeekDayValue } from './week-day.domain-primitive';

describe('WeekDay', function () {
  it('should be created', function () {
    const weekDay = new WeekDay(WeekDayValue.Monday);

    expect(weekDay).to.be.instanceOf(DomainPrimitive);
    expect(weekDay.value).to.be.equal(WeekDayValue.Monday);
  });

  it('should throw an error when value is invalid', function () {
    // @ts-expect-error - invalid value
    expect(() => new WeekDay('foo')).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'value' of WeekDay is invalid`,
    );
  });
});
