import { DeviceMode, DeviceModeValue } from '@agnoc/domain';
import { DomainException, NotImplementedException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceModeMapper } from './device-mode.mapper';

describe('DeviceModeMapper', function () {
  let mapper: DeviceModeMapper;

  beforeEach(function () {
    mapper = new DeviceModeMapper();
  });

  describe('#toDomain()', function () {
    it('should return a none device mode', function () {
      const deviceMode = mapper.toDomain(0);

      expect(deviceMode).to.be.instanceOf(DeviceMode);
      expect(deviceMode.value).to.be.equal(DeviceModeValue.None);
    });

    it('should return a zone device mode', function () {
      const deviceMode = mapper.toDomain(30);

      expect(deviceMode).to.be.instanceOf(DeviceMode);
      expect(deviceMode.value).to.be.equal(DeviceModeValue.Zone);
    });

    it('should return an spot device mode', function () {
      const deviceMode = mapper.toDomain(7);

      expect(deviceMode).to.be.instanceOf(DeviceMode);
      expect(deviceMode.value).to.be.equal(DeviceModeValue.Spot);
    });

    it('should return a mop device mode', function () {
      const deviceMode = mapper.toDomain(36);

      expect(deviceMode).to.be.instanceOf(DeviceMode);
      expect(deviceMode.value).to.be.equal(DeviceModeValue.Mop);
    });

    it('should throw an error when device mode is unknown', function () {
      expect(() => mapper.toDomain(999)).to.throw(DomainException, 'Unable to map device mode from mode 999');
    });
  });

  describe('#fromDomain()', function () {
    it('should throw an error', function () {
      expect(() => mapper.fromDomain()).to.throw(NotImplementedException, 'DeviceModeMapper.fromDomain');
    });
  });
});
