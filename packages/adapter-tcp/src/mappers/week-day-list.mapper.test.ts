import { WeekDay, WeekDayValue } from '@agnoc/domain';
import { expect } from 'chai';
import { WeekDayDomainToRobotMap, WeekDayListMapper } from './week-day-list.mapper';

describe('WeekDayListMapper', function () {
  let mapper: WeekDayListMapper;

  beforeEach(function () {
    mapper = new WeekDayListMapper();
  });

  describe('#toDomain()', function () {
    it('should return an array of WeekDay', function () {
      const weekDay = WeekDayDomainToRobotMap.Monday | WeekDayDomainToRobotMap.Wednesday;
      const weekDayList = mapper.toDomain(weekDay);

      expect(weekDayList.length).to.be.equal(2);
      expect(weekDayList[0]).to.be.instanceOf(WeekDay);
      expect(weekDayList[1]).to.be.instanceOf(WeekDay);
      expect(weekDayList[0].value).to.be.equal(WeekDayValue.Monday);
      expect(weekDayList[1].value).to.be.equal(WeekDayValue.Wednesday);
    });
  });

  describe('#fromDomain()', function () {
    it('should return a number', function () {
      const weekDayList = [new WeekDay(WeekDayValue.Monday), new WeekDay(WeekDayValue.Wednesday)];
      const weekDay = mapper.fromDomain(weekDayList);

      expect(weekDay).to.be.equal(WeekDayDomainToRobotMap.Monday | WeekDayDomainToRobotMap.Wednesday);
    });
  });
});
