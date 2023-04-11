import { ArgumentInvalidException, ArgumentNotProvidedException, Command, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { Zone } from '../entities/zone.entity';
import { givenSomeZoneProps } from '../test-support';
import { CleanZonesCommand } from './clean-zones.command';
import type { CleanZonesCommandInput } from './clean-zones.command';

describe('CleanZonesCommand', function () {
  it('should be created', function () {
    const input = givenACleanZonesCommandInput();
    const command = new CleanZonesCommand(input);

    expect(command).to.be.instanceOf(Command);
    expect(command.deviceId).to.be.equal(input.deviceId);
    expect(command.zones).to.be.equal(input.zones);
  });

  it("should throw an error when 'deviceId' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new CleanZonesCommand({ ...givenACleanZonesCommandInput(), deviceId: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'deviceId' for CleanZonesCommand not provided`,
    );
  });

  it("should throw an error when 'deviceId' is not an ID", function () {
    // @ts-expect-error - invalid property
    expect(() => new CleanZonesCommand({ ...givenACleanZonesCommandInput(), deviceId: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'deviceId' of CleanZonesCommand is not an instance of ID`,
    );
  });

  it("should throw an error when 'zones' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new CleanZonesCommand({ ...givenACleanZonesCommandInput(), zones: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'zones' for CleanZonesCommand not provided`,
    );
  });

  it("should throw an error when 'zones' is not an array", function () {
    // @ts-expect-error - invalid property
    expect(() => new CleanZonesCommand({ ...givenACleanZonesCommandInput(), zones: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'zones' of CleanZonesCommand is not an array`,
    );
  });

  it("should throw an error when 'zones' is not an array of Zone", function () {
    // @ts-expect-error - invalid property
    expect(() => new CleanZonesCommand({ ...givenACleanZonesCommandInput(), zones: ['foo'] })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'zones' of CleanZonesCommand is not an array of Zone`,
    );
  });
});

function givenACleanZonesCommandInput(): CleanZonesCommandInput {
  return { deviceId: ID.generate(), zones: [new Zone(givenSomeZoneProps())] };
}
