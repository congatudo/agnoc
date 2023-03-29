import { ArgumentInvalidException, ArgumentNotProvidedException, Command, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { ReturnHomeCommand } from './return-home.command';
import type { ReturnHomeCommandInput } from './return-home.command';

describe('ReturnHomeCommand', function () {
  it('should be created', function () {
    const input = givenAReturnHomeCommandInput();
    const command = new ReturnHomeCommand(input);

    expect(command).to.be.instanceOf(Command);
    expect(command.deviceId).to.be.equal(input.deviceId);
  });

  it("should throw an error when 'deviceId' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new ReturnHomeCommand({ ...givenAReturnHomeCommandInput(), deviceId: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'deviceId' for ReturnHomeCommand not provided`,
    );
  });

  it("should throw an error when 'deviceId' is not an ID", function () {
    // @ts-expect-error - invalid property
    expect(() => new ReturnHomeCommand({ ...givenAReturnHomeCommandInput(), deviceId: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'deviceId' of ReturnHomeCommand is not an instance of ID`,
    );
  });
});

function givenAReturnHomeCommandInput(): ReturnHomeCommandInput {
  return { deviceId: ID.generate() };
}
