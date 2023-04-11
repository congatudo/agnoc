import { ArgumentInvalidException, ArgumentNotProvidedException, Command, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { StopCleaningCommand } from './stop-cleaning.command';
import type { StopCleaningCommandInput } from './stop-cleaning.command';

describe('StopCleaningCommand', function () {
  it('should be created', function () {
    const input = givenAStopCleaningCommandInput();
    const command = new StopCleaningCommand(input);

    expect(command).to.be.instanceOf(Command);
    expect(command.deviceId).to.be.equal(input.deviceId);
  });

  it("should throw an error when 'deviceId' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new StopCleaningCommand({ ...givenAStopCleaningCommandInput(), deviceId: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'deviceId' for StopCleaningCommand not provided`,
    );
  });

  it("should throw an error when 'deviceId' is not an ID", function () {
    // @ts-expect-error - invalid property
    expect(() => new StopCleaningCommand({ ...givenAStopCleaningCommandInput(), deviceId: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'deviceId' of StopCleaningCommand is not an instance of ID`,
    );
  });
});

function givenAStopCleaningCommandInput(): StopCleaningCommandInput {
  return { deviceId: ID.generate() };
}
