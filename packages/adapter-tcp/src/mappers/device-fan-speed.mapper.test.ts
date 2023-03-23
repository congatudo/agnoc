import { DeviceFanSpeed, DeviceFanSpeedValue } from '@agnoc/domain';
import { expect } from 'chai';
import { DeviceFanSpeedMapper } from './device-fan-speed.mapper';

describe('DeviceFanSpeedMapper', function () {
  let mapper: DeviceFanSpeedMapper;

  beforeEach(function () {
    mapper = new DeviceFanSpeedMapper();
  });

  describe('#toDomain()', function () {
    it('should return a DeviceFanSpeed', function () {
      const deviceFanSpeed = mapper.toDomain(0);

      expect(deviceFanSpeed).to.be.instanceOf(DeviceFanSpeed);
      expect(deviceFanSpeed.value).to.be.equal(DeviceFanSpeedValue.Off);
    });
  });

  describe('#fromDomain()', function () {
    it('should return a number', function () {
      const deviceFanSpeed = new DeviceFanSpeed(DeviceFanSpeedValue.Off);
      const deviceFanSpeedValue = mapper.fromDomain(deviceFanSpeed);

      expect(deviceFanSpeedValue).to.be.equal(0);
    });
  });
});
