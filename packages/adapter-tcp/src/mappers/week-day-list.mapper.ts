import { WeekDay } from '@agnoc/domain';
import type { WeekDayValue } from '@agnoc/domain';
import type { Mapper } from '@agnoc/toolkit';

export const WeekDayDomainToRobotMap: Record<WeekDayValue, number> = {
  Sunday: 1 << 0,
  Monday: 1 << 1,
  Tuesday: 1 << 2,
  Wednesday: 1 << 3,
  Thursday: 1 << 4,
  Friday: 1 << 5,
  Saturday: 1 << 6,
};

export class WeekDayListMapper implements Mapper<WeekDay[], number> {
  toDomain(weekDay: number): WeekDay[] {
    return Object.entries(WeekDayDomainToRobotMap)
      .filter(([, value]) => (weekDay & value) === value)
      .map(([key]) => new WeekDay(key as WeekDayValue));
  }

  fromDomain(weekDayList: WeekDay[]): number {
    return weekDayList.reduce((acc, weekDay) => acc | WeekDayDomainToRobotMap[weekDay.value], 0);
  }
}
