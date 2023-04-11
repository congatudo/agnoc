import { ArgumentInvalidException, ArgumentNotProvidedException, Command, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { givenSomeVoiceSettingProps } from '../test-support';
import { VoiceSetting } from '../value-objects/voice-setting.value-object';
import { SetDeviceVoiceCommand } from './set-device-voice.command';
import type { SetDeviceVoiceCommandInput } from './set-device-voice.command';

describe('SetDeviceVoiceCommand', function () {
  it('should be created', function () {
    const input = givenASetDeviceVoiceCommandInput();
    const command = new SetDeviceVoiceCommand(input);

    expect(command).to.be.instanceOf(Command);
    expect(command.deviceId).to.be.equal(input.deviceId);
    expect(command.voice).to.be.equal(input.voice);
  });

  it("should throw an error when 'deviceId' is not provided", function () {
    expect(
      // @ts-expect-error - missing property
      () => new SetDeviceVoiceCommand({ ...givenASetDeviceVoiceCommandInput(), deviceId: undefined }),
    ).to.throw(ArgumentNotProvidedException, `Property 'deviceId' for SetDeviceVoiceCommand not provided`);
  });

  it("should throw an error when 'deviceId' is not an ID", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new SetDeviceVoiceCommand({ ...givenASetDeviceVoiceCommandInput(), deviceId: 'foo' }),
    ).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'deviceId' of SetDeviceVoiceCommand is not an instance of ID`,
    );
  });

  it("should throw an error when 'voice' is not provided", function () {
    expect(
      // @ts-expect-error - missing property
      () => new SetDeviceVoiceCommand({ ...givenASetDeviceVoiceCommandInput(), voice: undefined }),
    ).to.throw(ArgumentNotProvidedException, `Property 'voice' for SetDeviceVoiceCommand not provided`);
  });

  it("should throw an error when 'voice' is not an VoiceSetting", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new SetDeviceVoiceCommand({ ...givenASetDeviceVoiceCommandInput(), voice: 'foo' }),
    ).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'voice' of SetDeviceVoiceCommand is not an instance of VoiceSetting`,
    );
  });
});

function givenASetDeviceVoiceCommandInput(): SetDeviceVoiceCommandInput {
  return { deviceId: ID.generate(), voice: new VoiceSetting(givenSomeVoiceSettingProps()) };
}
