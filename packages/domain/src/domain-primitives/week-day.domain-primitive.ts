import { DomainPrimitive } from '@agnoc/toolkit';

/** Describes a week day value. */
export enum WeekDayValue {
  'Monday' = 'Monday',
  'Tuesday' = 'Tuesday',
  'Wednesday' = 'Wednesday',
  'Thursday' = 'Thursday',
  'Friday' = 'Friday',
  'Saturday' = 'Saturday',
  'Sunday' = 'Sunday',
}

/**
 * Describes a week day.
 *
 * Allowed values from {@link WeekDayValue}.
 */
export class WeekDay extends DomainPrimitive<WeekDayValue> {
  protected validate(props: DomainPrimitive<WeekDayValue>): void {
    this.validateListProp(props, 'value', Object.values(WeekDayValue));
  }
}
