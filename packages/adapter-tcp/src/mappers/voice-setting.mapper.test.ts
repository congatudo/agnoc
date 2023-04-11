import { VoiceSetting } from '@agnoc/domain';
import { expect } from 'chai';
import { VoiceSettingMapper } from './voice-setting.mapper';

describe('VoiceSettingMapper', function () {
  let mapper: VoiceSettingMapper;

  beforeEach(function () {
    mapper = new VoiceSettingMapper();
  });

  describe('#toDomain()', function () {
    it('should return a VoiceSetting', function () {
      const voiceSetting = mapper.toDomain({ isEnabled: true, volume: 6 });

      expect(voiceSetting).to.be.instanceOf(VoiceSetting);
      expect(voiceSetting.isEnabled).to.be.equal(true);
      expect(voiceSetting.volume).to.be.equal(50);
    });

    it('should return a VoiceSetting with defaults', function () {
      const voiceSetting = mapper.toDomain({ isEnabled: undefined, volume: undefined });

      expect(voiceSetting).to.be.instanceOf(VoiceSetting);
      expect(voiceSetting.isEnabled).to.be.equal(false);
      expect(voiceSetting.volume).to.be.equal(0);
    });
  });

  describe('#fromDomain()', function () {
    it('should return a number', function () {
      const voiceSetting = new VoiceSetting({ isEnabled: true, volume: 50 });
      const voiceSettingValue = mapper.fromDomain(voiceSetting);

      expect(voiceSettingValue.isEnabled).to.be.equal(true);
      expect(voiceSettingValue.volume).to.be.equal(6);
    });
  });
});
