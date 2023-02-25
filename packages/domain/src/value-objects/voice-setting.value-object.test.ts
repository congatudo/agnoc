import { ArgumentNotProvidedException, ArgumentInvalidException, ArgumentOutOfRangeException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { VoiceSetting } from './voice-setting.value-object';

describe('VoiceSetting', function () {
  it('should create a voice setting', function () {
    const voiceSetting = new VoiceSetting({
      isEnabled: true,
      volume: 50,
    });

    expect(voiceSetting.isEnabled).to.be.equal(true);
    expect(voiceSetting.volume).to.be.equal(50);
  });

  it("should throw an error when 'isEnabled' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new VoiceSetting({ volume: 50 })).to.throw(
      ArgumentNotProvidedException,
      `Property 'isEnabled' for voice setting not provided`,
    );
  });

  it("should throw an error when 'isEnabled' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new VoiceSetting({ isEnabled: 'foo', volume: 50 })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'isEnabled' for voice setting is not a boolean`,
    );
  });

  it("should throw an error when 'volume' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new VoiceSetting({ isEnabled: true })).to.throw(
      ArgumentNotProvidedException,
      `Property 'volume' for voice setting not provided`,
    );
  });

  it("should throw an error when 'volume' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new VoiceSetting({ isEnabled: true, volume: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'volume' for voice setting is not a number`,
    );
  });

  it("should throw an error when 'volume' property is out of range", function () {
    expect(() => new VoiceSetting({ isEnabled: true, volume: 150 })).to.throw(
      ArgumentOutOfRangeException,
      `Value '150' for property 'volume' for voice setting is out of range`,
    );
  });
});
