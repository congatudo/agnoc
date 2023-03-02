import { ArgumentNotProvidedException, ArgumentInvalidException, ArgumentOutOfRangeException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { givenSomeVoiceSettingProps } from '../test-support';
import { VoiceSetting } from './voice-setting.value-object';

describe('VoiceSetting', function () {
  it('should create a VoiceSetting', function () {
    const voiceSettingProps = givenSomeVoiceSettingProps();
    const voiceSetting = new VoiceSetting(voiceSettingProps);

    expect(voiceSetting.isEnabled).to.be.equal(voiceSettingProps.isEnabled);
    expect(voiceSetting.volume).to.be.equal(voiceSettingProps.volume);
  });

  it("should throw an error when 'isEnabled' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new VoiceSetting({ ...givenSomeVoiceSettingProps(), isEnabled: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'isEnabled' for VoiceSetting not provided`,
    );
  });

  it("should throw an error when 'isEnabled' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new VoiceSetting({ ...givenSomeVoiceSettingProps(), isEnabled: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'isEnabled' for VoiceSetting is not a boolean`,
    );
  });

  it("should throw an error when 'volume' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new VoiceSetting({ ...givenSomeVoiceSettingProps(), volume: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'volume' for VoiceSetting not provided`,
    );
  });

  it("should throw an error when 'volume' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new VoiceSetting({ ...givenSomeVoiceSettingProps(), volume: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'volume' for VoiceSetting is not a number`,
    );
  });

  it("should throw an error when 'volume' property is out of range", function () {
    expect(() => new VoiceSetting({ ...givenSomeVoiceSettingProps(), volume: 150 })).to.throw(
      ArgumentOutOfRangeException,
      `Value '150' for property 'volume' for VoiceSetting is out of range`,
    );
  });
});
