import { DeviceWaterLevel, DeviceWaterLevelValue } from '@agnoc/domain';
import { expect } from 'chai';
import { DeviceWaterLevelMapper } from './device-water-level.mapper';

describe('DeviceWaterLevelMapper', function () {
  let mapper: DeviceWaterLevelMapper;

  beforeEach(function () {
    mapper = new DeviceWaterLevelMapper();
  });

  describe('#toDomain()', function () {
    it('should return a DeviceWaterLevel', function () {
      const deviceWaterLevel = mapper.toDomain(10);

      expect(deviceWaterLevel).to.be.instanceOf(DeviceWaterLevel);
      expect(deviceWaterLevel.value).to.be.equal(DeviceWaterLevelValue.Off);
    });
  });

  describe('#fromDomain()', function () {
    it('should return a number', function () {
      const deviceWaterLevel = new DeviceWaterLevel(DeviceWaterLevelValue.Off);
      const deviceWaterLevelValue = mapper.fromDomain(deviceWaterLevel);

      expect(deviceWaterLevelValue).to.be.equal(10);
    });
  });
});
