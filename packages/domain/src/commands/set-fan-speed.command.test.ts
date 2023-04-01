import { ArgumentInvalidException, ArgumentNotProvidedException, Command, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceFanSpeed, DeviceFanSpeedValue } from '../domain-primitives/device-fan-speed.domain-primitive';
import { SetFanSpeedCommand } from './set-fan-speed.command';
import type { SetFanSpeedCommandInput } from './set-fan-speed.command';

describe('SetFanSpeedCommand', function () {
  it('should be created', function () {
    const input = givenASetFanSpeedCommandInput();
    const command = new SetFanSpeedCommand(input);

    expect(command).to.be.instanceOf(Command);
    expect(command.deviceId).to.be.equal(input.deviceId);
    expect(command.fanSpeed).to.be.equal(input.fanSpeed);
  });

  it("should throw an error when 'deviceId' is not provided", function () {
    expect(
      // @ts-expect-error - missing property
      () => new SetFanSpeedCommand({ ...givenASetFanSpeedCommandInput(), deviceId: undefined }),
    ).to.throw(ArgumentNotProvidedException, `Property 'deviceId' for SetFanSpeedCommand not provided`);
  });

  it("should throw an error when 'deviceId' is not an ID", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new SetFanSpeedCommand({ ...givenASetFanSpeedCommandInput(), deviceId: 'foo' }),
    ).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'deviceId' of SetFanSpeedCommand is not an instance of ID`,
    );
  });

  it("should throw an error when 'fanSpeed' is not provided", function () {
    expect(
      // @ts-expect-error - missing property
      () => new SetFanSpeedCommand({ ...givenASetFanSpeedCommandInput(), fanSpeed: undefined }),
    ).to.throw(ArgumentNotProvidedException, `Property 'fanSpeed' for SetFanSpeedCommand not provided`);
  });

  it("should throw an error when 'fanSpeed' is not an DeviceFanSpeed", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new SetFanSpeedCommand({ ...givenASetFanSpeedCommandInput(), fanSpeed: 'foo' }),
    ).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'fanSpeed' of SetFanSpeedCommand is not an instance of DeviceFanSpeed`,
    );
  });
});

function givenASetFanSpeedCommandInput(): SetFanSpeedCommandInput {
  return { deviceId: ID.generate(), fanSpeed: new DeviceFanSpeed(DeviceFanSpeedValue.Low) };
}
