import { DeviceBattery } from '@agnoc/domain';
import { expect } from 'chai';
import { DeviceBatteryMapper } from './device-battery.mapper';

describe('DeviceBatteryMapper', function () {
  let mapper: DeviceBatteryMapper;

  beforeEach(function () {
    mapper = new DeviceBatteryMapper();
  });

  describe('#toDomain()', function () {
    it('should return a DeviceBattery', function () {
      const deviceBattery = mapper.toDomain(150);

      expect(deviceBattery).to.be.instanceOf(DeviceBattery);
      expect(deviceBattery.value).to.be.equal(50);
    });

    it('should return a DeviceBattery with minimum value when below minimum', function () {
      const deviceBattery = mapper.toDomain(-50);

      expect(deviceBattery).to.be.instanceOf(DeviceBattery);
      expect(deviceBattery.value).to.be.equal(0);
    });

    it('should return a DeviceBattery with maximum value when above maximum', function () {
      const deviceBattery = mapper.toDomain(250);

      expect(deviceBattery).to.be.instanceOf(DeviceBattery);
      expect(deviceBattery.value).to.be.equal(100);
    });
  });

  describe('#fromDomain()', function () {
    it('should return a number', function () {
      const deviceBattery = new DeviceBattery(50);
      const deviceBatteryValue = mapper.fromDomain(deviceBattery);

      expect(deviceBatteryValue).to.be.equal(150);
    });
  });
});
