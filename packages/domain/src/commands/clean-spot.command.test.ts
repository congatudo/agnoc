import { ArgumentInvalidException, ArgumentNotProvidedException, Command, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { givenSomeMapCoordinateProps } from '../test-support';
import { MapCoordinate } from '../value-objects/map-coordinate.value-object';
import { CleanSpotCommand } from './clean-spot.command';
import type { CleanSpotCommandInput } from './clean-spot.command';

describe('CleanSpotCommand', function () {
  it('should be created', function () {
    const input = givenACleanSpotCommandInput();
    const command = new CleanSpotCommand(input);

    expect(command).to.be.instanceOf(Command);
    expect(command.deviceId).to.be.equal(input.deviceId);
    expect(command.spot).to.be.equal(input.spot);
  });

  it("should throw an error when 'deviceId' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new CleanSpotCommand({ ...givenACleanSpotCommandInput(), deviceId: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'deviceId' for CleanSpotCommand not provided`,
    );
  });

  it("should throw an error when 'deviceId' is not an ID", function () {
    // @ts-expect-error - invalid property
    expect(() => new CleanSpotCommand({ ...givenACleanSpotCommandInput(), deviceId: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'deviceId' of CleanSpotCommand is not an instance of ID`,
    );
  });

  it("should throw an error when 'spot' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new CleanSpotCommand({ ...givenACleanSpotCommandInput(), spot: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'spot' for CleanSpotCommand not provided`,
    );
  });

  it("should throw an error when 'spot' is not an MapCoordinate", function () {
    // @ts-expect-error - invalid property
    expect(() => new CleanSpotCommand({ ...givenACleanSpotCommandInput(), spot: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'spot' of CleanSpotCommand is not an instance of MapCoordinate`,
    );
  });
});

function givenACleanSpotCommandInput(): CleanSpotCommandInput {
  return { deviceId: ID.generate(), spot: new MapCoordinate(givenSomeMapCoordinateProps()) };
}
