import { ArgumentInvalidException, ArgumentNotProvidedException, Command, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceConsumable, DeviceConsumableType } from '../value-objects/device-consumable.value-object';
import { ResetConsumableCommand } from './reset-consumable.command';
import type { ResetConsumableCommandInput } from './reset-consumable.command';

describe('ResetConsumableCommand', function () {
  it('should be created', function () {
    const input = givenAResetConsumableCommandInput();
    const command = new ResetConsumableCommand(input);

    expect(command).to.be.instanceOf(Command);
    expect(command.deviceId).to.be.equal(input.deviceId);
    expect(command.consumable).to.be.equal(input.consumable);
  });

  it("should throw an error when 'deviceId' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new ResetConsumableCommand({ ...givenAResetConsumableCommandInput(), deviceId: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'deviceId' for ResetConsumableCommand not provided`,
    );
  });

  it("should throw an error when 'consumable' is not provided", function () {
    expect(
      // @ts-expect-error - missing property
      () => new ResetConsumableCommand({ ...givenAResetConsumableCommandInput(), consumable: undefined }),
    ).to.throw(ArgumentNotProvidedException, `Property 'consumable' for ResetConsumableCommand not provided`);
  });

  it("should throw an error when 'deviceId' is not an ID", function () {
    // @ts-expect-error - invalid property
    expect(() => new ResetConsumableCommand({ ...givenAResetConsumableCommandInput(), deviceId: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'deviceId' of ResetConsumableCommand is not an instance of ID`,
    );
  });

  it("should throw an error when 'consumable' is not an ID", function () {
    // @ts-expect-error - invalid property
    expect(() => new ResetConsumableCommand({ ...givenAResetConsumableCommandInput(), consumable: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'consumable' of ResetConsumableCommand is not an instance of DeviceConsumable`,
    );
  });
});

function givenAResetConsumableCommandInput(): ResetConsumableCommandInput {
  return {
    deviceId: ID.generate(),
    consumable: new DeviceConsumable({ type: DeviceConsumableType.MainBrush, hoursUsed: 5 }),
  };
}
