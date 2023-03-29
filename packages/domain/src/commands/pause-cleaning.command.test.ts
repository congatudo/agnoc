import { ArgumentInvalidException, ArgumentNotProvidedException, Command, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { PauseCleaningCommand } from './pause-cleaning.command';
import type { PauseCleaningCommandInput } from './pause-cleaning.command';

describe('PauseCleaningCommand', function () {
  it('should be created', function () {
    const input = givenAPauseCleaningCommandInput();
    const command = new PauseCleaningCommand(input);

    expect(command).to.be.instanceOf(Command);
    expect(command.deviceId).to.be.equal(input.deviceId);
  });

  it("should throw an error when 'deviceId' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new PauseCleaningCommand({ ...givenAPauseCleaningCommandInput(), deviceId: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'deviceId' for PauseCleaningCommand not provided`,
    );
  });

  it("should throw an error when 'deviceId' is not an ID", function () {
    // @ts-expect-error - invalid property
    expect(() => new PauseCleaningCommand({ ...givenAPauseCleaningCommandInput(), deviceId: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'deviceId' of PauseCleaningCommand is not an instance of ID`,
    );
  });
});

function givenAPauseCleaningCommandInput(): PauseCleaningCommandInput {
  return { deviceId: ID.generate() };
}
