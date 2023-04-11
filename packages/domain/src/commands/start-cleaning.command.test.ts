import { ArgumentInvalidException, ArgumentNotProvidedException, Command, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { StartCleaningCommand } from './start-cleaning.command';
import type { StartCleaningCommandInput } from './start-cleaning.command';

describe('StartCleaningCommand', function () {
  it('should be created', function () {
    const input = givenAStartCleaningCommandInput();
    const command = new StartCleaningCommand(input);

    expect(command).to.be.instanceOf(Command);
    expect(command.deviceId).to.be.equal(input.deviceId);
  });

  it("should throw an error when 'deviceId' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new StartCleaningCommand({ ...givenAStartCleaningCommandInput(), deviceId: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'deviceId' for StartCleaningCommand not provided`,
    );
  });

  it("should throw an error when 'deviceId' is not an ID", function () {
    // @ts-expect-error - invalid property
    expect(() => new StartCleaningCommand({ ...givenAStartCleaningCommandInput(), deviceId: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'deviceId' of StartCleaningCommand is not an instance of ID`,
    );
  });
});

function givenAStartCleaningCommandInput(): StartCleaningCommandInput {
  return { deviceId: ID.generate() };
}
