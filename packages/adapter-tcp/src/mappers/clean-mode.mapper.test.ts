import { CleanMode, CleanModeValue } from '@agnoc/domain';
import { expect } from 'chai';
import { CleanModeMapper } from './clean-mode.mapper';

describe('CleanModeMapper', function () {
  let mapper: CleanModeMapper;

  beforeEach(function () {
    mapper = new CleanModeMapper();
  });

  describe('#toDomain()', function () {
    it('should return a CleanMode', function () {
      const cleanMode = mapper.toDomain(1);

      expect(cleanMode).to.be.instanceOf(CleanMode);
      expect(cleanMode.value).to.be.equal(CleanModeValue.Auto);
    });
  });

  describe('#fromDomain()', function () {
    it('should return a number', function () {
      const cleanMode = new CleanMode(CleanModeValue.Auto);
      const cleanModeValue = mapper.fromDomain(cleanMode);

      expect(cleanModeValue).to.be.equal(1);
    });
  });
});
