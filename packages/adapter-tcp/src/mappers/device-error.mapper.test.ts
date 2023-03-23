import { DeviceError, DeviceErrorValue } from '@agnoc/domain';
import { DomainException, NotImplementedException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceErrorMapper } from './device-error.mapper';

describe('DeviceErrorMapper', function () {
  let mapper: DeviceErrorMapper;

  beforeEach(function () {
    mapper = new DeviceErrorMapper();
  });

  describe('#toDomain()', function () {
    it('should return a DeviceError', function () {
      const deviceError = mapper.toDomain(0);

      expect(deviceError).to.be.instanceOf(DeviceError);
      expect(deviceError.value).to.be.equal(DeviceErrorValue.None);
    });

    it('should throw an error when device mode is unknown', function () {
      expect(() => mapper.toDomain(999)).to.throw(DomainException, `Unable to map error code '999' to domain value`);
    });
  });

  describe('#fromDomain()', function () {
    it('should throw an error', function () {
      expect(() => mapper.fromDomain()).to.throw(NotImplementedException, 'DeviceErrorMapper.fromDomain');
    });
  });
});
