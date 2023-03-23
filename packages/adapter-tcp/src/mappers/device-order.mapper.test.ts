import {
  DeviceFanSpeed,
  DeviceFanSpeedValue,
  DeviceWaterLevel,
  DeviceWaterLevelValue,
  CleanMode,
  CleanModeValue,
  WeekDay,
  WeekDayValue,
  DeviceOrder,
  DeviceTime,
} from '@agnoc/domain';
import { ArgumentNotProvidedException, ID } from '@agnoc/toolkit';
import { anything, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { DeviceOrderMapper } from './device-order.mapper';
import type { CleanModeMapper } from './clean-mode.mapper';
import type { DeviceFanSpeedMapper } from './device-fan-speed.mapper';
import type { DeviceWaterLevelMapper } from './device-water-level.mapper';
import type { WeekDayListMapper } from './week-day-list.mapper';

describe('DeviceOrderMapper', function () {
  let deviceFanSpeedMapper: DeviceFanSpeedMapper;
  let deviceWaterLevelMapper: DeviceWaterLevelMapper;
  let cleanModeMapper: CleanModeMapper;
  let weekDayListMapper: WeekDayListMapper;
  let mapper: DeviceOrderMapper;

  beforeEach(function () {
    deviceFanSpeedMapper = imock();
    deviceWaterLevelMapper = imock();
    cleanModeMapper = imock();
    weekDayListMapper = imock();
    mapper = new DeviceOrderMapper(
      instance(deviceFanSpeedMapper),
      instance(deviceWaterLevelMapper),
      instance(cleanModeMapper),
      instance(weekDayListMapper),
    );
  });

  describe('#toDomain()', function () {
    it('should return a DeviceOrder', function () {
      when(deviceFanSpeedMapper.toDomain(anything())).thenReturn(new DeviceFanSpeed(DeviceFanSpeedValue.Off));
      when(deviceWaterLevelMapper.toDomain(anything())).thenReturn(new DeviceWaterLevel(DeviceWaterLevelValue.Off));
      when(cleanModeMapper.toDomain(anything())).thenReturn(new CleanMode(CleanModeValue.Auto));
      when(weekDayListMapper.toDomain(anything())).thenReturn([new WeekDay(WeekDayValue.Monday)]);

      const deviceOrder = mapper.toDomain({
        orderId: 1,
        enable: true,
        repeat: true,
        weekDay: 1,
        dayTime: 90,
        cleanInfo: {
          mapHeadId: 2,
          planId: 3,
          cleanMode: 4,
          windPower: 5,
          waterLevel: 6,
          twiceClean: true,
        },
      });

      expect(deviceOrder).to.be.instanceOf(DeviceOrder);
      expect(deviceOrder.id.equals(new ID(1))).to.be.true;
      expect(deviceOrder.mapId.equals(new ID(2))).to.be.true;
      expect(deviceOrder.planId.equals(new ID(3))).to.be.true;
      expect(deviceOrder.isEnabled).to.be.true;
      expect(deviceOrder.isRepeatable).to.be.true;
      expect(deviceOrder.isDeepClean).to.be.true;
      expect(deviceOrder.weekDays).to.deep.contain(new WeekDay(WeekDayValue.Monday));
      expect(deviceOrder.time.equals(new DeviceTime({ hours: 1, minutes: 30 }))).to.be.true;
      expect(deviceOrder.cleanMode.equals(new CleanMode(CleanModeValue.Auto))).to.be.true;
      expect(deviceOrder.fanSpeed.equals(new DeviceFanSpeed(DeviceFanSpeedValue.Off))).to.be.true;
      expect(deviceOrder.waterLevel.equals(new DeviceWaterLevel(DeviceWaterLevelValue.Off))).to.be.true;

      verify(deviceFanSpeedMapper.toDomain(5)).once();
      verify(deviceWaterLevelMapper.toDomain(6)).once();
      verify(cleanModeMapper.toDomain(4)).once();
      verify(weekDayListMapper.toDomain(1)).once();
    });

    it('should return a DeviceOrder when order list has no water level', function () {
      when(deviceFanSpeedMapper.toDomain(anything())).thenReturn(new DeviceFanSpeed(DeviceFanSpeedValue.Off));
      when(cleanModeMapper.toDomain(anything())).thenReturn(new CleanMode(CleanModeValue.Auto));
      when(weekDayListMapper.toDomain(anything())).thenReturn([new WeekDay(WeekDayValue.Monday)]);

      const deviceOrder = mapper.toDomain({
        orderId: 1,
        enable: true,
        repeat: true,
        weekDay: 1,
        dayTime: 90,
        cleanInfo: {
          mapHeadId: 2,
          planId: 3,
          cleanMode: 4,
          windPower: 5,
          twiceClean: true,
        },
      });

      expect(deviceOrder).to.be.instanceOf(DeviceOrder);
      expect(deviceOrder.id.equals(new ID(1))).to.be.true;
      expect(deviceOrder.mapId.equals(new ID(2))).to.be.true;
      expect(deviceOrder.planId.equals(new ID(3))).to.be.true;
      expect(deviceOrder.isEnabled).to.be.true;
      expect(deviceOrder.isRepeatable).to.be.true;
      expect(deviceOrder.isDeepClean).to.be.true;
      expect(deviceOrder.weekDays).to.deep.contain(new WeekDay(WeekDayValue.Monday));
      expect(deviceOrder.time.equals(new DeviceTime({ hours: 1, minutes: 30 }))).to.be.true;
      expect(deviceOrder.cleanMode.equals(new CleanMode(CleanModeValue.Auto))).to.be.true;
      expect(deviceOrder.fanSpeed.equals(new DeviceFanSpeed(DeviceFanSpeedValue.Off))).to.be.true;
      expect(deviceOrder.waterLevel.equals(new DeviceWaterLevel(DeviceWaterLevelValue.Off))).to.be.true;

      verify(deviceFanSpeedMapper.toDomain(5)).once();
      verify(deviceWaterLevelMapper.toDomain(anything())).never();
      verify(cleanModeMapper.toDomain(4)).once();
      verify(weekDayListMapper.toDomain(1)).once();
    });

    it("should throw an error when 'cleanInfo' is not defined", function () {
      expect(() =>
        mapper.toDomain({
          orderId: 1,
          enable: true,
          repeat: true,
          weekDay: 1,
          dayTime: 90,
        }),
      ).to.throw(ArgumentNotProvidedException, 'Unable to read clean info from order list');
    });
  });

  describe('#fromDomain()', function () {
    it('should return an order list', function () {
      const deviceOrder = new DeviceOrder({
        id: new ID(1),
        mapId: new ID(2),
        planId: new ID(3),
        isEnabled: true,
        isRepeatable: true,
        isDeepClean: true,
        weekDays: [new WeekDay(WeekDayValue.Monday)],
        time: new DeviceTime({ hours: 1, minutes: 30 }),
        cleanMode: new CleanMode(CleanModeValue.Auto),
        fanSpeed: new DeviceFanSpeed(DeviceFanSpeedValue.Off),
        waterLevel: new DeviceWaterLevel(DeviceWaterLevelValue.Off),
      });

      when(deviceFanSpeedMapper.fromDomain(anything())).thenReturn(5);
      when(deviceWaterLevelMapper.fromDomain(anything())).thenReturn(6);
      when(cleanModeMapper.fromDomain(anything())).thenReturn(4);
      when(weekDayListMapper.fromDomain(anything())).thenReturn(1);

      const orderList = mapper.fromDomain(deviceOrder);

      expect(orderList.orderId).to.be.equal(1);
      expect(orderList.enable).to.be.true;
      expect(orderList.repeat).to.be.true;
      expect(orderList.weekDay).to.be.equal(1);
      expect(orderList.dayTime).to.be.equal(90);
      expect(orderList.cleanInfo).to.be.deep.equal({
        mapHeadId: 2,
        planId: 3,
        cleanMode: 4,
        windPower: 5,
        waterLevel: 6,
        twiceClean: true,
      });

      verify(deviceFanSpeedMapper.fromDomain(deviceOrder.fanSpeed)).once();
      verify(deviceWaterLevelMapper.fromDomain(deviceOrder.waterLevel)).once();
      verify(cleanModeMapper.fromDomain(deviceOrder.cleanMode)).once();
      verify(weekDayListMapper.fromDomain(deviceOrder.weekDays)).once();
    });
  });
});
