import { ArgumentInvalidException, ArgumentNotProvidedException, Command, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceSetting } from '../value-objects/device-setting.value-object';
import { SetCarpetModeCommand } from './set-carpet-mode.command';
import type { SetCarpetModeCommandInput } from './set-carpet-mode.command';

describe('SetCarpetModeCommand', function () {
  it('should be created', function () {
    const input = givenASetCarpetModeCommandInput();
    const command = new SetCarpetModeCommand(input);

    expect(command).to.be.instanceOf(Command);
    expect(command.deviceId).to.be.equal(input.deviceId);
    expect(command.carpetMode).to.be.equal(input.carpetMode);
  });

  it("should throw an error when 'deviceId' is not provided", function () {
    expect(
      // @ts-expect-error - missing property
      () => new SetCarpetModeCommand({ ...givenASetCarpetModeCommandInput(), deviceId: undefined }),
    ).to.throw(ArgumentNotProvidedException, `Property 'deviceId' for SetCarpetModeCommand not provided`);
  });

  it("should throw an error when 'deviceId' is not an ID", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new SetCarpetModeCommand({ ...givenASetCarpetModeCommandInput(), deviceId: 'foo' }),
    ).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'deviceId' of SetCarpetModeCommand is not an instance of ID`,
    );
  });

  it("should throw an error when 'carpetMode' is not provided", function () {
    expect(
      // @ts-expect-error - missing property
      () => new SetCarpetModeCommand({ ...givenASetCarpetModeCommandInput(), carpetMode: undefined }),
    ).to.throw(ArgumentNotProvidedException, `Property 'carpetMode' for SetCarpetModeCommand not provided`);
  });

  it("should throw an error when 'carpetMode' is not an VoiceSetting", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new SetCarpetModeCommand({ ...givenASetCarpetModeCommandInput(), carpetMode: 'foo' }),
    ).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'carpetMode' of SetCarpetModeCommand is not an instance of DeviceSetting`,
    );
  });
});

function givenASetCarpetModeCommandInput(): SetCarpetModeCommandInput {
  return { deviceId: ID.generate(), carpetMode: new DeviceSetting({ isEnabled: true }) };
}
