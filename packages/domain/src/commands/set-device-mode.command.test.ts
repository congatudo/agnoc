import { ArgumentInvalidException, ArgumentNotProvidedException, Command, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceMode, DeviceModeValue } from '../domain-primitives/device-mode.domain-primitive';
import { SetDeviceModeCommand } from './set-device-mode.command';
import type { SetDeviceModeCommandInput } from './set-device-mode.command';

describe('SetDeviceModeCommand', function () {
  it('should be created', function () {
    const input = givenASetDeviceModeCommandInput();
    const command = new SetDeviceModeCommand(input);

    expect(command).to.be.instanceOf(Command);
    expect(command.deviceId).to.be.equal(input.deviceId);
    expect(command.mode).to.be.equal(input.mode);
  });

  it("should throw an error when 'deviceId' is not provided", function () {
    expect(
      // @ts-expect-error - missing property
      () => new SetDeviceModeCommand({ ...givenASetDeviceModeCommandInput(), deviceId: undefined }),
    ).to.throw(ArgumentNotProvidedException, `Property 'deviceId' for SetDeviceModeCommand not provided`);
  });

  it("should throw an error when 'deviceId' is not an ID", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new SetDeviceModeCommand({ ...givenASetDeviceModeCommandInput(), deviceId: 'foo' }),
    ).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'deviceId' of SetDeviceModeCommand is not an instance of ID`,
    );
  });

  it("should throw an error when 'mode' is not provided", function () {
    expect(
      // @ts-expect-error - missing property
      () => new SetDeviceModeCommand({ ...givenASetDeviceModeCommandInput(), mode: undefined }),
    ).to.throw(ArgumentNotProvidedException, `Property 'mode' for SetDeviceModeCommand not provided`);
  });

  it("should throw an error when 'mode' is not an DeviceMode", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new SetDeviceModeCommand({ ...givenASetDeviceModeCommandInput(), mode: 'foo' }),
    ).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'mode' of SetDeviceModeCommand is not an instance of DeviceMode`,
    );
  });
});

function givenASetDeviceModeCommandInput(): SetDeviceModeCommandInput {
  return { deviceId: ID.generate(), mode: new DeviceMode(DeviceModeValue.None) };
}
