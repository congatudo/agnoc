import { ArgumentInvalidException, ArgumentNotProvidedException, Command, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceWaterLevel, DeviceWaterLevelValue } from '../domain-primitives/device-water-level.domain-primitive';
import { SetWaterLevelCommand } from './set-water-level.command';
import type { SetWaterLevelCommandInput } from './set-water-level.command';

describe('SetWaterLevelCommand', function () {
  it('should be created', function () {
    const input = givenASetWaterLevelCommandInput();
    const command = new SetWaterLevelCommand(input);

    expect(command).to.be.instanceOf(Command);
    expect(command.deviceId).to.be.equal(input.deviceId);
    expect(command.waterLevel).to.be.equal(input.waterLevel);
  });

  it("should throw an error when 'deviceId' is not provided", function () {
    expect(
      // @ts-expect-error - missing property
      () => new SetWaterLevelCommand({ ...givenASetWaterLevelCommandInput(), deviceId: undefined }),
    ).to.throw(ArgumentNotProvidedException, `Property 'deviceId' for SetWaterLevelCommand not provided`);
  });

  it("should throw an error when 'deviceId' is not an ID", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new SetWaterLevelCommand({ ...givenASetWaterLevelCommandInput(), deviceId: 'foo' }),
    ).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'deviceId' of SetWaterLevelCommand is not an instance of ID`,
    );
  });

  it("should throw an error when 'waterLevel' is not provided", function () {
    expect(
      // @ts-expect-error - missing property
      () => new SetWaterLevelCommand({ ...givenASetWaterLevelCommandInput(), waterLevel: undefined }),
    ).to.throw(ArgumentNotProvidedException, `Property 'waterLevel' for SetWaterLevelCommand not provided`);
  });

  it("should throw an error when 'waterLevel' is not an DeviceWaterLevel", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new SetWaterLevelCommand({ ...givenASetWaterLevelCommandInput(), waterLevel: 'foo' }),
    ).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'waterLevel' of SetWaterLevelCommand is not an instance of DeviceWaterLevel`,
    );
  });
});

function givenASetWaterLevelCommandInput(): SetWaterLevelCommandInput {
  return { deviceId: ID.generate(), waterLevel: new DeviceWaterLevel(DeviceWaterLevelValue.Low) };
}
