import { ArgumentInvalidException, ArgumentNotProvidedException, Command, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { LocateDeviceCommand } from './locate-device.command';
import type { LocateDeviceCommandInput } from './locate-device.command';

describe('LocateDeviceCommand', function () {
  it('should be created', function () {
    const input = givenALocateDeviceCommandInput();
    const command = new LocateDeviceCommand(input);

    expect(command).to.be.instanceOf(Command);
    expect(command.deviceId).to.be.equal(input.deviceId);
  });

  it("should throw an error when 'deviceId' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new LocateDeviceCommand({ ...givenALocateDeviceCommandInput(), deviceId: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'deviceId' for LocateDeviceCommand not provided`,
    );
  });

  it("should throw an error when 'deviceId' is not an ID", function () {
    // @ts-expect-error - invalid property
    expect(() => new LocateDeviceCommand({ ...givenALocateDeviceCommandInput(), deviceId: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'deviceId' of LocateDeviceCommand is not an instance of ID`,
    );
  });
});

function givenALocateDeviceCommandInput(): LocateDeviceCommandInput {
  return { deviceId: ID.generate() };
}
