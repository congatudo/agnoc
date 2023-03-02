import { ArgumentInvalidException, ArgumentNotProvidedException, Entity } from '@agnoc/toolkit';
import { expect } from 'chai';
import { givenSomeRoomProps } from '../test-support';
import { Room } from './room.entity';

describe('Room', function () {
  it('should be created', function () {
    const roomProps = givenSomeRoomProps();
    const room = new Room(roomProps);

    expect(room).to.be.instanceOf(Entity);
    expect(room.id).to.be.equal(roomProps.id);
    expect(room.name).to.be.equal('room');
    expect(room.isEnabled).to.be.equal(true);
    expect(room.center).to.be.equal(roomProps.center);
    expect(room.pixels).to.be.equal(roomProps.pixels);
  });

  it("should throw an error when 'name' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new Room({ ...givenSomeRoomProps(), name: undefined })).to.throw(
      ArgumentNotProvidedException,
      "Property 'name' for Room not provided",
    );
  });

  it("should throw an error when 'isEnabled' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new Room({ ...givenSomeRoomProps(), isEnabled: undefined })).to.throw(
      ArgumentNotProvidedException,
      "Property 'isEnabled' for Room not provided",
    );
  });

  it("should throw an error when 'center' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new Room({ ...givenSomeRoomProps(), center: undefined })).to.throw(
      ArgumentNotProvidedException,
      "Property 'center' for Room not provided",
    );
  });

  it("should throw an error when 'pixels' are not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new Room({ ...givenSomeRoomProps(), pixels: undefined })).to.throw(
      ArgumentNotProvidedException,
      "Property 'pixels' for Room not provided",
    );
  });

  it("should throw an error when 'name' is not a string", function () {
    // @ts-expect-error - invalid property
    expect(() => new Room({ ...givenSomeRoomProps(), name: 1 })).to.throw(
      ArgumentInvalidException,
      "Property 'name' for Room is not a string",
    );
  });

  it("should throw an error when 'isEnabled' is not a boolean", function () {
    // @ts-expect-error - invalid property
    expect(() => new Room({ ...givenSomeRoomProps(), isEnabled: 'foo' })).to.throw(
      ArgumentInvalidException,
      "Property 'isEnabled' for Room is not a boolean",
    );
  });

  it("should throw an error when 'center' is not a MapCoordinate", function () {
    // @ts-expect-error - invalid property
    expect(() => new Room({ ...givenSomeRoomProps(), center: 'foo' })).to.throw(
      ArgumentInvalidException,
      "Property 'center' for Room is not a MapCoordinate",
    );
  });

  it("should throw an error when 'pixels' are not an array", function () {
    // @ts-expect-error - invalid property
    expect(() => new Room({ ...givenSomeRoomProps(), pixels: 'foo' })).to.throw(
      ArgumentInvalidException,
      "Property 'pixels' for Room is not an array of MapPixel",
    );
  });

  it("should throw an error when 'pixels' are not an array of MapPixel", function () {
    // @ts-expect-error - invalid property
    expect(() => new Room({ ...givenSomeRoomProps(), pixels: ['foo'] })).to.throw(
      ArgumentInvalidException,
      "Property 'pixels' for Room is not an array of MapPixel",
    );
  });
});
